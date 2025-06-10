import type { CollectionConfig, User } from 'payload/types';

const Attractions: CollectionConfig = {
  slug: 'attractions',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }: { req: { user?: User } }) => !!user,
    update: ({ req: { user } }: { req: { user?: User } }) => !!user,
    delete: ({ req: { user } }: { req: { user?: User } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
    },
    {
      name: 'location',
      type: 'group',
      fields: [
        {
          name: 'address',
          type: 'text',
        },
        {
          name: 'city',
          type: 'text',
        },
        {
          name: 'country',
          type: 'text',
        },
        {
          name: 'coordinates',
          type: 'point',
        },
      ],
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'gallery',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'bestTimeToVisit',
      type: 'text',
      admin: {
        description: 'Best time to visit (e.g., "Year-round", "June to October")',
      },
    },
    {
      name: 'entryFee',
      type: 'text',
      admin: {
        description: 'Entry fee information (e.g., "Free", "$10 for adults, $5 for children")',
      },
    },
  ],
};

export default Attractions;
