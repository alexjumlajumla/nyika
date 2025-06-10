import { CollectionConfig, Access } from 'payload/types';

// Access control functions
const isAdminOrHasAccess: Access = ({ req: { user } }) => {
  if (!user) return false;
  return user.roles?.includes('admin') || false;
};

const isAuthenticated: Access = ({ req: { user } }) => {
  return !!user;
};

const Prices: CollectionConfig = {
  slug: 'prices',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    // Allow all users to read prices
    read: () => true,
    // Only authenticated users can create prices
    create: isAuthenticated,
    // Only authenticated users can update prices
    update: isAuthenticated,
    // Only admins can delete prices
    delete: isAdminOrHasAccess,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Name of the pricing item (e.g., "Safari Tour", "Accommodation")',
      },
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'currency',
      type: 'text',
      defaultValue: 'USD',
      admin: {
        description: 'Currency code (e.g., USD, EUR, KES)',
      },
    },
    {
      name: 'duration',
      type: 'text',
      admin: {
        description: 'Duration of the service (e.g., "per night", "per person")',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Whether this price is currently active',
      },
    },
    {
      name: 'validFrom',
      type: 'date',
      admin: {
        description: 'Date from which this price is valid',
      },
    },
    {
      name: 'validUntil',
      type: 'date',
      admin: {
        description: 'Date until which this price is valid (leave empty for no expiration)',
      },
    },
    {
      name: 'relatedTo',
      type: 'relationship',
      relationTo: ['tours', 'accommodations'],
      admin: {
        description: 'Optional: Link this price to a specific tour or accommodation',
      },
    },
  ],
};

export default Prices;
