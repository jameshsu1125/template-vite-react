import { RestPath } from '@/settings/config';
import { faker } from '@faker-js/faker';
import { mergePath } from 'lesca-fetcher';
import { rest } from 'msw';

export const handlers = [
  rest.get(mergePath(RestPath.test), (_, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        userId: faker.string.uuid(),
        id: faker.number.int(10),
        title: faker.lorem.lines(1),
        completed: faker.datatype.boolean(),
      }),
    );
  }),
];
