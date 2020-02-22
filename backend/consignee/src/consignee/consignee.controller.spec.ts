import { Test, TestingModule } from '@nestjs/testing';
import { ConsigneeController } from './consignee.controller';

describe('Consignee Controller', () => {
  let controller: ConsigneeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConsigneeController],
    }).compile();

    controller = module.get<ConsigneeController>(ConsigneeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
