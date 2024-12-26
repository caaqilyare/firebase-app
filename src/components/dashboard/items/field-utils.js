import { fieldTypes } from './field-types';

// Define field type groups with their corresponding field type values
const FIELD_GROUPS = {
  // Code fields
  code: {
    types: ['code'],
    matches: [
      'code',
      'command',
      'script',
      'query',
      'shell',
      'bash',
      'sql',
      'terminal',
      'console',
      'cmd',
      'powershell'
    ]
  },

  // Always hidden by default (sensitive data)
  sensitive: {
    types: ['password', 'key', 'hidden'],
    matches: [
      'password',
      'secret',
      'key',
      'token',
      'auth',
      'private',
      'credential',
    ]
  },

  // URL fields
  url: {
    types: ['url'],
    matches: [
      'url',
      'endpoint',
      'link',
      'documentation',
      'website',
      'site',
      'api',
    ]
  },

  // Identity fields
  identity: {
    types: ['username', 'email'],
    matches: [
      'username',
      'user',
      'email',
      'login',
      'account',
    ]
  },

  // System fields
  system: {
    types: ['text', 'number'],
    matches: [
      'host',
      'port',
      'server',
      'domain',
      'ip',
      'path',
    ]
  },

  // Wallet/Crypto fields
  crypto: {
    types: ['wallet'],
    matches: [
      'wallet',
      'address',
      'crypto',
      'bitcoin',
      'ethereum',
    ]
  },

  notes: {
    types: ['note'],
    matches: [
      'note',
      'description',
      'comment',
      'memo',
      'details',
      'text',
      'content'
    ]
  },

  number: {
    types: ['number'],
    matches: [
      'number',
      'count',
      'amount',
      'quantity',
      'total',
      'id'
    ]
  },

  phone: {
    types: ['phone'],
    matches: [
      'phone',
      'mobile',
      'cell',
      'telephone',
      'contact'
    ]
  }
};

export function getFieldType(fieldName) {
  const normalizedName = fieldName.toLowerCase();

  // Check for number fields
  if (/^\d+$/.test(normalizedName) || FIELD_GROUPS.number.matches.some(keyword => normalizedName.includes(keyword))) {
    return {
      ...fieldTypes.find(t => t.value === 'number'),
      isSecret: false,
      group: 'number'
    };
  }

  // Check for phone fields
  if (FIELD_GROUPS.phone.matches.some(keyword => normalizedName.includes(keyword))) {
    return {
      ...fieldTypes.find(t => t.value === 'phone'),
      isSecret: false,
      group: 'phone'
    };
  }

  // First check for code-related fields
  if (FIELD_GROUPS.code.matches.some(keyword => normalizedName.includes(keyword))) {
    return {
      ...fieldTypes.find(t => t.value === 'code'),
      isSecret: false,
      group: 'code'
    };
  }

  // Helper function to check if name matches any keywords in a group
  const matchesGroup = (group) => 
    group.matches.some(keyword => normalizedName.includes(keyword));

  // Find matching group
  const matchedGroup = Object.entries(FIELD_GROUPS).find(([_, group]) => 
    matchesGroup(group)
  );

  if (matchedGroup) {
    const [groupName, group] = matchedGroup;
    // Get the first matching field type from the group's allowed types
    const fieldType = fieldTypes.find(type => 
      group.types.includes(type.value)
    );

    return {
      ...fieldType,
      isSecret: groupName === 'sensitive',
      group: groupName
    };
  }

  // Default to text type if no matches
  return {
    ...fieldTypes.find(t => t.value === 'text'),
    isSecret: false,
    group: 'other'
  };
}

// Helper function to get field display
export function getFieldDisplay(fieldName, fieldValue) {
  const fieldType = getFieldType(fieldName);
  
  if (fieldType.group === 'code') {
    return {
      ...fieldTypes.find(t => t.value === 'code'),
      isSecret: false,
      group: 'code'
    };
  }

  if (fieldType.group === 'notes') {
    return {
      ...fieldTypes.find(t => t.value === 'note'),
      isSecret: false,
      group: 'notes'
    };
  }

  return fieldType;
}

// Helper function to check if a field should be hidden by default
export function isSecretField(fieldName) {
  const fieldType = getFieldType(fieldName);
  return fieldType.isSecret;
}

// Helper function to get field group
export function getFieldGroup(fieldName) {
  const fieldType = getFieldType(fieldName);
  return fieldType.group;
}
