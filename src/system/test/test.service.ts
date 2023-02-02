import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { TestEntity } from './entities/test.entity';
import { Repository } from 'typeorm';
import { RedisUtilService } from 'src/common/libs/redis/redis.service';
import { EventsGateway } from '../events/events.gateway';
@Injectable()
export class TestService {
  constructor(
    @InjectRepository(TestEntity)
    private readonly testRepository: Repository<TestEntity>,
    private readonly redisService: RedisUtilService,
    private readonly eventsGateway: EventsGateway,
  ) {}

  create(createTestDto: CreateTestDto) {
    return 'This action adds a new test';
  }

  async findAll() {
    this.eventsGateway.PublicMessage('loginEvent', { token: 'sdfjkashf' });
    // 写这里直接get就存，方便，，
    await this.redisService.set('hello', 'hello', 60 * 60 * 24);
    return await this.testRepository.save({ title: 'title', desc: 'desc' });
    return `This action returns all test`;
  }

  async findOne(id: string) {
    return await this.testRepository.findOneBy({ id });
    return `This action returns a #${id} test`;
  }

  update(id: number, updateTestDto: UpdateTestDto) {
    return `This action updates a #${id} test`;
  }

  remove(id: number) {
    return `This action removes a #${id} test`;
  }
}
