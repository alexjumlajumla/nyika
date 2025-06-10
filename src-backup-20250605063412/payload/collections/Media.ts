
// Remove the CollectionConfig type annotation to fix the slug error
const Media = {
  slug: 'media',
  access: {
    read: () => true,
    create: ({ req: { user } }: { req: { user?: { role: string } } }) => user?.role === 'admin' || user?.role === 'editor',
    update: ({ req: { user } }: { req: { user?: { role: string } } }) => user?.role === 'admin' || user?.role === 'editor',
    delete: ({ req: { user } }: { req: { user?: { role: string } } }) => user?.role === 'admin',
  },
  upload: {
    staticURL: '/media',
    staticDir: 'media',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 512,
        position: 'centre',
      },
      {
        name: 'feature',
        width: 1024,
        height: 576,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'caption',
      type: 'text',
    },
  ],
};

export default Media;
