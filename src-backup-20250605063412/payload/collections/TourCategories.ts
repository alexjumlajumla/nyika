import { CollectionConfig, Access, Field } from 'payload/types';

// Define field types
type TextField = {
  name: string;
  type: 'text';
  required?: boolean;
  admin?: {
    position?: 'sidebar' | 'main';
    [key: string]: unknown;
  };
};

type TextareaField = {
  name: string;
  type: 'textarea';
  required?: boolean;
};

type UploadField = {
  name: string;
  type: 'upload';
  relationTo: string;
  required?: boolean;
};

type FieldType = TextField | TextareaField | UploadField;

// Define a custom type that extends CollectionConfig
export type TourCategoriesConfig = CollectionConfig & {
  slug: 'tour-categories';
  admin: {
    useAsTitle: string;
    defaultColumns: string[];
    group: string;
  };
  fields: FieldType[];
};

// Define the collection configuration with proper types
const TourCategories: TourCategoriesConfig = {
  slug: 'tour-categories',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug'],
    group: 'Tours',
  },
  access: {
    read: () => true,
    create: (({ req: { user } }) => {
      if (!user) return false;
      return ['admin', 'editor'].includes(user.role);
    }) as Access,
    update: (({ req: { user } }) => {
      if (!user) return false;
      return ['admin', 'editor'].includes(user.role);
    }) as Access,
    delete: (({ req: { user } }) => {
      if (!user) return false;
      return user.role === 'admin';
    }) as Access,
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
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
  ],
};

export default TourCategories;
