// src/modules/permissions/enums/permission-names.enum.ts

export enum PermissionNames {
    // Authentication & Authorization
    CREATE_USER = 'create_user',
    READ_USER = 'read_user',
    UPDATE_USER = 'update_user',
    DELETE_USER = 'delete_user',

    // Roles & Permissions
    CREATE_ROLE = 'create_role',
    READ_ROLE = 'read_role',
    UPDATE_ROLE = 'update_role',
    DELETE_ROLE = 'delete_role',

    // Projects
    CREATE_PROJECT = 'create_project',
    READ_PROJECT = 'read_project',
    UPDATE_PROJECT = 'update_project',
    DELETE_PROJECT = 'delete_project',

    // Time Entries
    CREATE_TIME_ENTRY = 'create_time_entry',
    READ_TIME_ENTRY = 'read_time_entry',
    UPDATE_TIME_ENTRY = 'update_time_entry',
    DELETE_TIME_ENTRY = 'delete_time_entry',

    // Conversations & Messages
    CREATE_CONVERSATION = 'create_conversation',
    READ_CONVERSATION = 'read_conversation',
    SEND_MESSAGE = 'send_message',
    READ_MESSAGE = 'read_message',

    // Support Tickets (NEW)
    MANAGE_SUPPORT_TICKETS = 'manage_support_tickets',
}