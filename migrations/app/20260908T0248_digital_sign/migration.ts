#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/af2b89a543a858ed67dd91fb9ad4eaa69076fb53e0cadba5a0717e1cd2e6fdd1/contract';
import endContract from '../../snapshots/af2b89a543a858ed67dd91fb9ad4eaa69076fb53e0cadba5a0717e1cd2e6fdd1/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  fn,
  lit,
  primaryKey,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'audit_logs',
        columns: [
          col('action', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('actor_user_id', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('created_at', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', '"uuid"', {
            notNull: true,
            codecRef: { codecId: 'pg/uuid@1', typeParams: {} },
          }),
          col('ip_address', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('metadata', 'json', { codecRef: { codecId: 'pg/json@1' } }),
          col('sign_request_id', '"uuid"', { codecRef: { codecId: 'pg/uuid@1', typeParams: {} } }),
          col('user_agent', 'text', { codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'audit_logs_action_check_d56752b7',
            "\"action\" IN ('SIGN_REQUEST_CREATED', 'DOCUMENT_CREATED', 'DOCUMENT_OPENED', 'PLACEMENT_CREATED', 'PLACEMENT_UPDATED', 'SIGN_ATTEMPT', 'PIN_FAILED', 'SIGNED', 'REJECTED', 'FAILED', 'CANCELLED')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'documents',
        columns: [
          col('created_at', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('file_key', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('file_size', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('hash', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', '"uuid"', {
            notNull: true,
            codecRef: { codecId: 'pg/uuid@1', typeParams: {} },
          }),
          col('locked', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('mime_type', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('sign_request_id', '"uuid"', {
            notNull: true,
            codecRef: { codecId: 'pg/uuid@1', typeParams: {} },
          }),
          col('type', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updated_at', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'documents_type_check_b4fd3c0b',
            "\"type\" IN ('ORIGINAL', 'SIGNED', 'ATTACHMENT')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'sign_requests',
        columns: [
          col('created_at', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', '"uuid"', {
            notNull: true,
            codecRef: { codecId: 'pg/uuid@1', typeParams: {} },
          }),
          col('reference_id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('rejected_at', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-temporal@1' } }),
          col('rejection_reason', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('signed_at', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-temporal@1' } }),
          col('signer_user_id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('PENDING'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('updated_at', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('village_id', 'text', { codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'sign_requests_status_check_14769a7d',
            "\"status\" IN ('PENDING', 'PROCESSING', 'SIGNED', 'REJECTED', 'FAILED', 'CANCELLED')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'signature_placements',
        columns: [
          col('created_at', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('document_id', '"uuid"', {
            notNull: true,
            codecRef: { codecId: 'pg/uuid@1', typeParams: {} },
          }),
          col('height', 'float8', { notNull: true, codecRef: { codecId: 'pg/float8@1' } }),
          col('id', '"uuid"', {
            notNull: true,
            codecRef: { codecId: 'pg/uuid@1', typeParams: {} },
          }),
          col('page', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('sequence', 'int4', {
            notNull: true,
            default: lit(1),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('sign_request_id', '"uuid"', {
            notNull: true,
            codecRef: { codecId: 'pg/uuid@1', typeParams: {} },
          }),
          col('signer_user_id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('type', 'text', {
            notNull: true,
            default: lit('SIGNATURE'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('updated_at', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('width', 'float8', { notNull: true, codecRef: { codecId: 'pg/float8@1' } }),
          col('x', 'float8', { notNull: true, codecRef: { codecId: 'pg/float8@1' } }),
          col('y', 'float8', { notNull: true, codecRef: { codecId: 'pg/float8@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'signature_placements_type_check_577a5452',
            "\"type\" IN ('SIGNATURE', 'INITIAL', 'STAMP', 'QR_CODE')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'signatures',
        columns: [
          col('algorithm', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('certificate_issuer', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('certificate_serial', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('document_hash', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('document_id', '"uuid"', {
            notNull: true,
            codecRef: { codecId: 'pg/uuid@1', typeParams: {} },
          }),
          col('id', '"uuid"', {
            notNull: true,
            codecRef: { codecId: 'pg/uuid@1', typeParams: {} },
          }),
          col('sign_request_id', '"uuid"', {
            notNull: true,
            codecRef: { codecId: 'pg/uuid@1', typeParams: {} },
          }),
          col('signature_value', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('signed_at', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('signer_user_id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'signer_credentials',
        columns: [
          col('active', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('created_at', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('failed_attempt', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('id', '"uuid"', {
            notNull: true,
            codecRef: { codecId: 'pg/uuid@1', typeParams: {} },
          }),
          col('locked_until', 'timestamptz', {
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('pin_hash', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updated_at', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('user_id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'sign_requests',
        constraint: 'sign_requests_reference_id_key',
        columns: ['reference_id'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'signature_placements',
        constraint: 'signature_placements_document_id_signer_user_id_sequence_key',
        columns: ['document_id', 'signer_user_id', 'sequence'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'signer_credentials',
        constraint: 'signer_credentials_user_id_key',
        columns: ['user_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'audit_logs',
        index: 'audit_logs_action_idx_cd0d2116',
        columns: ['action'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'audit_logs',
        index: 'audit_logs_actor_user_id_idx_c46ca325',
        columns: ['actor_user_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'audit_logs',
        index: 'audit_logs_created_at_idx_225d8c0f',
        columns: ['created_at'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'audit_logs',
        index: 'audit_logs_sign_request_id_idx_caa2feef',
        columns: ['sign_request_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'documents',
        index: 'documents_created_at_idx_225d8c0f',
        columns: ['created_at'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'documents',
        index: 'documents_sign_request_id_idx_caa2feef',
        columns: ['sign_request_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'documents',
        index: 'documents_type_idx_b6b604ea',
        columns: ['type'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'sign_requests',
        index: 'sign_requests_created_at_idx_225d8c0f',
        columns: ['created_at'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'sign_requests',
        index: 'sign_requests_signer_user_id_idx_cda3000a',
        columns: ['signer_user_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'sign_requests',
        index: 'sign_requests_status_idx_e98638ab',
        columns: ['status'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'sign_requests',
        index: 'sign_requests_village_id_idx_baafdf98',
        columns: ['village_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'signature_placements',
        index: 'signature_placements_document_id_idx_d3d0944e',
        columns: ['document_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'signature_placements',
        index: 'signature_placements_sign_request_id_idx_caa2feef',
        columns: ['sign_request_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'signature_placements',
        index: 'signature_placements_signer_user_id_idx_cda3000a',
        columns: ['signer_user_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'signatures',
        index: 'signatures_document_id_idx_d3d0944e',
        columns: ['document_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'signatures',
        index: 'signatures_sign_request_id_idx_caa2feef',
        columns: ['sign_request_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'signatures',
        index: 'signatures_signed_at_idx_5cd80742',
        columns: ['signed_at'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'signatures',
        index: 'signatures_signer_user_id_idx_cda3000a',
        columns: ['signer_user_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'signer_credentials',
        index: 'signer_credentials_active_idx_8af4daed',
        columns: ['active'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'audit_logs',
        foreignKey: {
          name: 'audit_logs_sign_request_id_fkey',
          columns: ['sign_request_id'],
          references: { schema: 'public', table: 'sign_requests', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'documents',
        foreignKey: {
          name: 'documents_sign_request_id_fkey',
          columns: ['sign_request_id'],
          references: { schema: 'public', table: 'sign_requests', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'signature_placements',
        foreignKey: {
          name: 'signature_placements_sign_request_id_fkey',
          columns: ['sign_request_id'],
          references: { schema: 'public', table: 'sign_requests', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'signature_placements',
        foreignKey: {
          name: 'signature_placements_document_id_fkey',
          columns: ['document_id'],
          references: { schema: 'public', table: 'documents', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'signatures',
        foreignKey: {
          name: 'signatures_sign_request_id_fkey',
          columns: ['sign_request_id'],
          references: { schema: 'public', table: 'sign_requests', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'signatures',
        foreignKey: {
          name: 'signatures_document_id_fkey',
          columns: ['document_id'],
          references: { schema: 'public', table: 'documents', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
