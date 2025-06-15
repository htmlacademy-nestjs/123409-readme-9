import { PrismaClient } from '@prisma/client';

const FIRST_USER_ID = '658170cbb954e9f5b905ccf4';
const SECOND_USER_ID = '6581762309c030b503e30512';

function getPosts() {
  return [
    {
      type: 'article',
      status: 'published',
      authorId: FIRST_USER_ID,
      originalAuthorId: null,
      originalPostId: null,
      isRepost: false,
      publishedAt: new Date(),
      content: {
        title: 'Худеющий',
        announcement: 'Недавно прочитал страшный роман «Худеющий».',
        content: 'На мой взгляд, это один из самых страшных романов Стивена Кинга.'
      },
      tags: ['books', 'horror'],
      comments: [
        {
          content: 'Это действительно отличная книга!',
          authorId: FIRST_USER_ID,
        },
        {
          content: 'Надо будет обязательно перечитать. Слишком много информации.',
          authorId: SECOND_USER_ID,
        }
      ]
    },
    {
      type: 'article',
      status: 'published',
      authorId: FIRST_USER_ID,
      originalAuthorId: null,
      originalPostId: null,
      isRepost: false,
      publishedAt: new Date(),
      content: {
        title: 'Вы не знаете JavaScript',
        announcement: 'Полезная книга по JavaScript',
        content: 'Секреты и тайные знания по JavaScript.'
      },
      tags: ['programming', 'javascript', 'books'],
      comments: [
        {
          content: 'Отличная книга для изучения JavaScript!',
          authorId: SECOND_USER_ID,
        }
      ]
    }
  ];
}

async function seedDb(prismaClient: PrismaClient) {
  const mockPosts = getPosts();
  
  for (const post of mockPosts) {
    await prismaClient.post.create({
      data: {
        type: post.type,
        status: post.status,
        authorId: post.authorId,
        originalAuthorId: post.originalAuthorId,
        originalPostId: post.originalPostId,
        isRepost: post.isRepost,
        publishedAt: post.publishedAt,
        content: post.content,
        tags: post.tags,
        comments: post.comments ? {
          create: post.comments
        } : undefined
      }
    });
  }

  console.info('🤘️ Database was filled');
}

async function bootstrap() {
  const prismaClient = new PrismaClient();

  try {
    await seedDb(prismaClient);
    globalThis.process.exit(0);
  } catch (error: unknown) {
    console.error(error);
    globalThis.process.exit(1);
  } finally {
    await prismaClient.$disconnect();
  }
}

bootstrap();
