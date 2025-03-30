import { Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto';
import { Container } from '@azure/cosmos';
import { DatabaseService } from 'src/database/database.service';
import { User } from './entities/user.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  private usersContainer: Container;

  constructor(private readonly databaseService: DatabaseService) {    
  }

  onModuleInit() {
    this.usersContainer = this.databaseService.userContainer;
  }


  async create(createUserDto: CreateUserDto): Promise<User | undefined> {
    const newUser = {
      ...createUserDto,
      id: uuidv4(),
      created_at: new Date(),
      updated_at: new Date(),
    };

    console.log(createUserDto)

    const { resource, statusCode } = await this.usersContainer.items.create(newUser)
    if (statusCode !== 201) {
      throw new Error(`Failed to create user: ${statusCode}`);
    }

    return resource;
  }

  async findAll(): Promise<User[]> {
    const { resources } = await this.usersContainer.items.readAll().fetchAll();
    if (!resources) {
      throw new Error('Failed to fetch users');
    }
    return resources as User[];
  }

  async findOneViaId(id: string): Promise<User | undefined> {
    const { resource } = await this.usersContainer.item(id, id).read<User>();
    if (!resource) {
      throw new Error(`User with id ${id} not found`);
    }
    return resource;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<Partial<User> | undefined> {
    // First get the existing user
    const { resource: existingUser } = await this.usersContainer.item(id, id).read<User>();
    if (!existingUser) {
      throw new Error(`User with id ${id} not found`);
    }
    
    // Merge existing user with updates
    const updatedUser = {
      ...existingUser,
      ...updateUserDto,
      updated_at: new Date(),
    };
    
    // Replace the document
    const { resource, statusCode } = await this.usersContainer.item(id, id).replace(updatedUser);
    if (statusCode !== 200) {
      throw new Error(`Failed to update user: ${statusCode}`);
    }
    return resource;
  }

  async remove(id: string) {
    const { resource, statusCode } = await this.usersContainer.item(id, id).delete();
    if (statusCode !== 204) {
      throw new Error(`Failed to delete user: ${statusCode}`);
    }
    return resource;
  }
}
