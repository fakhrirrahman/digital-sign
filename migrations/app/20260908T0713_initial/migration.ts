#!/usr/bin/env -S bun
import type { Contract as End } from '../../snapshots/02087acd39039113d87c3070c74fcc3d9d9e72aa25a9ad3246bffc6a0a8e38bb/contract';
import endContract from '../../snapshots/02087acd39039113d87c3070c74fcc3d9d9e72aa25a9ad3246bffc6a0a8e38bb/contract.json' with { type: 'json' };
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
            'audit_logs_action_check_58c7dcda',
            "\"action\" IN ('SIGN_REQUEST_CREATED', 'APPROVAL_STARTED', 'APPROVAL_APPROVED', 'APPROVAL_REJECTED', 'PIN_VERIFICATION_SUCCESS', 'PIN_VERIFICATION_FAILED', 'SIGNATURE_PROFILE_CREATED', 'SIGNATURE_PROFILE_UPDATED', 'DOCUMENT_RECEIVED', 'DOCUMENT_HASHED', 'SIGNING_STARTED', 'SIGNING_COMPLETED', 'SIGNING_FAILED', 'SIGN_REQUEST_COMPLETED', 'SIGN_REQUEST_CANCELLED')",
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
          checkExpression('documents_type_check_d016bc72', "\"type\" IN ('FINAL', 'SIGNED')"),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'sign_request_approvals',
        columns: [
          col('approved_at', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-temporal@1' } }),
          col('created_at', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('height', 'float8', { notNull: true, codecRef: { codecId: 'pg/float8@1' } }),
          col('id', '"uuid"', {
            notNull: true,
            codecRef: { codecId: 'pg/uuid@1', typeParams: {} },
          }),
          col('letter_date', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-temporal@1' } }),
          col('letter_number', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('level', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('page', 'int4', {
            notNull: true,
            default: lit(1),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('permission', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('rejected_at', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-temporal@1' } }),
          col('rejection_reason', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('required', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('role', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('sequence', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('sign_request_id', '"uuid"', {
            notNull: true,
            codecRef: { codecId: 'pg/uuid@1', typeParams: {} },
          }),
          col('signer_user_id', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('PENDING'),
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
            'sign_request_approvals_level_check_534088a9',
            "\"level\" IN ('BANJAR', 'DESA')",
          ),
          checkExpression(
            'sign_request_approvals_status_check_6f336f18',
            "\"status\" IN ('PENDING', 'APPROVED', 'REJECTED', 'SKIPPED')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'sign_requests',
        columns: [
          col('banjar_id', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('cancelled_at', 'timestamptz', {
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('completed_at', 'timestamptz', {
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('created_at', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('current_sequence', 'int4', {
            notNull: true,
            default: lit(1),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('id', '"uuid"', {
            notNull: true,
            codecRef: { codecId: 'pg/uuid@1', typeParams: {} },
          }),
          col('reference_id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('PENDING'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('template_id', '"uuid"', {
            notNull: true,
            codecRef: { codecId: 'pg/uuid@1', typeParams: {} },
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
            'sign_requests_status_check_18dd2aa8',
            "\"status\" IN ('PENDING', 'IN_PROGRESS', 'READY_TO_SIGN', 'PROCESSING', 'SIGNED', 'REJECTED', 'FAILED', 'CANCELLED')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'signature_profiles',
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
          col('id', '"uuid"', {
            notNull: true,
            codecRef: { codecId: 'pg/uuid@1', typeParams: {} },
          }),
          col('signature_image_key', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updated_at', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('user_id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'signatures',
        columns: [
          col('algorithm', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('approval_id', '"uuid"', { codecRef: { codecId: 'pg/uuid@1', typeParams: {} } }),
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
          col('level', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
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
        constraints: [
          primaryKey(['id']),
          checkExpression('signatures_level_check_534088a9', "\"level\" IN ('BANJAR', 'DESA')"),
        ],
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
          col('last_pin_changed_at', 'timestamptz', {
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
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
      this.createTable({
        schema: 'public',
        table: 'signing_template_steps',
        columns: [
          col('created_at', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('height', 'float8', { notNull: true, codecRef: { codecId: 'pg/float8@1' } }),
          col('id', '"uuid"', {
            notNull: true,
            codecRef: { codecId: 'pg/uuid@1', typeParams: {} },
          }),
          col('level', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('page', 'int4', {
            notNull: true,
            default: lit(1),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('permission', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('required', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('role', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('sequence', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('template_id', '"uuid"', {
            notNull: true,
            codecRef: { codecId: 'pg/uuid@1', typeParams: {} },
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
            'signing_template_steps_level_check_534088a9',
            "\"level\" IN ('BANJAR', 'DESA')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'signing_templates',
        columns: [
          col('active', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('code', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('created_at', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('created_by', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('description', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', '"uuid"', {
            notNull: true,
            codecRef: { codecId: 'pg/uuid@1', typeParams: {} },
          }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updated_at', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('version', 'int4', {
            notNull: true,
            default: lit(1),
            codecRef: { codecId: 'pg/int4@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'sign_request_approvals',
        constraint: 'sign_request_approvals_sign_request_id_sequence_key',
        columns: ['sign_request_id', 'sequence'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'sign_requests',
        constraint: 'sign_requests_reference_id_key',
        columns: ['reference_id'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'signature_profiles',
        constraint: 'signature_profiles_user_id_key',
        columns: ['user_id'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'signer_credentials',
        constraint: 'signer_credentials_user_id_key',
        columns: ['user_id'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'signing_template_steps',
        constraint: 'signing_template_steps_template_id_sequence_key',
        columns: ['template_id', 'sequence'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'signing_templates',
        constraint: 'signing_templates_code_version_key',
        columns: ['code', 'version'],
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
        index: 'documents_hash_idx_d25bc543',
        columns: ['hash'],
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
        table: 'sign_request_approvals',
        index: 'sign_request_approvals_level_idx_30977cf3',
        columns: ['level'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'sign_request_approvals',
        index: 'sign_request_approvals_role_idx_2c1ddf83',
        columns: ['role'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'sign_request_approvals',
        index: 'sign_request_approvals_sign_request_id_idx_caa2feef',
        columns: ['sign_request_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'sign_request_approvals',
        index: 'sign_request_approvals_signer_user_id_idx_cda3000a',
        columns: ['signer_user_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'sign_request_approvals',
        index: 'sign_request_approvals_status_idx_e98638ab',
        columns: ['status'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'sign_requests',
        index: 'sign_requests_banjar_id_idx_a22e78bc',
        columns: ['banjar_id'],
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
        index: 'sign_requests_current_sequence_idx_4c3b5cb4',
        columns: ['current_sequence'],
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
        index: 'sign_requests_template_id_idx_dc536619',
        columns: ['template_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'sign_requests',
        index: 'sign_requests_village_id_idx_baafdf98',
        columns: ['village_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'signature_profiles',
        index: 'signature_profiles_active_idx_8af4daed',
        columns: ['active'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'signatures',
        index: 'signatures_approval_id_idx_6a894154',
        columns: ['approval_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'signatures',
        index: 'signatures_document_hash_idx_4efcc750',
        columns: ['document_hash'],
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
        index: 'signatures_level_idx_30977cf3',
        columns: ['level'],
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
      this.createIndex({
        schema: 'public',
        table: 'signing_template_steps',
        index: 'signing_template_steps_level_idx_30977cf3',
        columns: ['level'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'signing_template_steps',
        index: 'signing_template_steps_role_idx_2c1ddf83',
        columns: ['role'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'signing_template_steps',
        index: 'signing_template_steps_template_id_idx_dc536619',
        columns: ['template_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'signing_templates',
        index: 'signing_templates_active_idx_8af4daed',
        columns: ['active'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'signing_templates',
        index: 'signing_templates_code_idx_8e43b86b',
        columns: ['code'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'signing_templates',
        index: 'signing_templates_created_by_idx_e13bb8bf',
        columns: ['created_by'],
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
        table: 'sign_request_approvals',
        foreignKey: {
          name: 'sign_request_approvals_sign_request_id_fkey',
          columns: ['sign_request_id'],
          references: { schema: 'public', table: 'sign_requests', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'sign_requests',
        foreignKey: {
          name: 'sign_requests_template_id_fkey',
          columns: ['template_id'],
          references: { schema: 'public', table: 'signing_templates', columns: ['id'] },
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
          name: 'signatures_approval_id_fkey',
          columns: ['approval_id'],
          references: { schema: 'public', table: 'sign_request_approvals', columns: ['id'] },
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
      this.addForeignKey({
        schema: 'public',
        table: 'signing_template_steps',
        foreignKey: {
          name: 'signing_template_steps_template_id_fkey',
          columns: ['template_id'],
          references: { schema: 'public', table: 'signing_templates', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
