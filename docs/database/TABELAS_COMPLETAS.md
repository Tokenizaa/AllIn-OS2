# TABELAS COMPLETAS - INVENTÁRIO DO BANCO DE DADOS

**Data**: 8 de Junho de 2026  
**Projeto**: sistema-allin  
**Project ID**: isjsydhuqurneswstlyx  
**Total de Tabelas**: 120+

---

## Resumo por Schema

| Schema | Quantidade de Tabelas | Total de Registros |
|--------|----------------------|-------------------|
| public | 48 | 164,000+ |
| auth | 19 | 175 |
| analytics | 4 | 112 |
| storage | 7 | 62 |
| backup_2026_05_28 | 50 | 8,408 |
| scrape_backup | 3 | 0 |
| realtime | 3 | 73 |
| cron | 2 | 3 |
| vault | 1 | 0 |
| supabase_migrations | 1 | 173 |
| **TOTAL** | **138** | **173,000+** |

---

## Schema: analytics

| Tabela | Registros | Status |
|--------|-----------|--------|
| ai_conversations | 0 | VAZIA |
| ai_insights | 0 | VAZIA |
| ai_messages | 0 | VAZIA |
| product_metrics | 112 | ATIVA |

**Total**: 4 tabelas, 112 registros

---

## Schema: auth

| Tabela | Registros | Status |
|--------|-----------|--------|
| audit_log_entries | 0 | VAZIA |
| custom_oauth_providers | 0 | VAZIA |
| flow_state | 0 | VAZIA |
| identities | 7 | ATIVA |
| instances | 0 | VAZIA |
| mfa_amr_claims | 24 | ATIVA |
| mfa_challenges | 0 | VAZIA |
| mfa_factors | 0 | VAZIA |
| oauth_authorizations | 0 | VAZIA |
| oauth_client_states | 0 | VAZIA |
| oauth_clients | 0 | VAZIA |
| oauth_consents | 0 | VAZIA |
| one_time_tokens | 1 | ATIVA |
| refresh_tokens | 35 | ATIVA |
| saml_providers | 0 | VAZIA |
| saml_relay_states | 0 | VAZIA |
| schema_migrations | 76 | ATIVA |
| sessions | 24 | ATIVA |
| sso_domains | 0 | VAZIA |
| sso_providers | 0 | VAZIA |
| users | 7 | ATIVA |
| webauthn_challenges | 0 | VAZIA |
| webauthn_credentials | 0 | VAZIA |

**Total**: 22 tabelas, 175 registros

---

## Schema: backup_2026_05_28

| Tabela | Registros | Status |
|--------|-----------|--------|
| account_transactions | 0 | VAZIA |
| accounts | 0 | VAZIA |
| ai_prompt_context | 0 | VAZIA |
| approval_requests | 0 | VAZIA |
| automations | 0 | VAZIA |
| boleto_details | 0 | VAZIA |
| bonus_calculations | 4,618 | BACKUP |
| bonus_rules | 19 | BACKUP |
| bonuses | 0 | VAZIA |
| bots | 0 | VAZIA |
| chargebacks | 0 | VAZIA |
| conversation_embeddings | 0 | VAZIA |
| customer_embeddings | 0 | VAZIA |
| customer_labels | 0 | VAZIA |
| customer_plans | 0 | VAZIA |
| customer_segments | 0 | VAZIA |
| delivery_payments | 0 | VAZIA |
| gateway_webhooks | 0 | VAZIA |
| gateways | 0 | VAZIA |
| generation_bonuses | 7 | BACKUP |
| import_rows | 0 | VAZIA |
| imports | 0 | VAZIA |
| insight_embeddings | 0 | VAZIA |
| installment_rules | 0 | VAZIA |
| labels | 24 | BACKUP |
| ledger | 0 | VAZIA |
| link_analytics | 0 | VAZIA |
| macros | 14 | BACKUP |
| mlm_campaign_bonuses | 0 | VAZIA |
| mlm_campaign_plans | 0 | VAZIA |
| mlm_campaigns | 0 | VAZIA |
| network_nodes | 0 | VAZIA |
| payment_attempts | 0 | VAZIA |
| payment_installments | 0 | VAZIA |
| payment_methods | 0 | VAZIA |
| pix_details | 0 | VAZIA |
| plan_benefits | 0 | VAZIA |
| plan_versions | 0 | VAZIA |
| product_embeddings | 0 | VAZIA |
| purchase_types | 5 | BACKUP |
| shipping_events | 0 | VAZIA |
| shipping_quotes | 0 | VAZIA |
| sponsor_change_requests | 0 | VAZIA |
| staging_customers | 0 | VAZIA |
| staging_order_items | 0 | VAZIA |
| staging_orders | 3,705 | BACKUP |
| staging_orders_detalhado | 0 | VAZIA |
| templates | 15 | BACKUP |
| transactions | 0 | VAZIA |
| user_qualifications | 0 | VAZIA |
| verification_documents | 0 | VAZIA |
| virtual_store_order_history | 0 | VAZIA |
| virtual_store_orders | 0 | VAZIA |
| wallets | 0 | VAZIA |

**Total**: 50 tabelas, 8,408 registros (backup)

---

## Schema: cron

| Tabela | Registros | Status |
|--------|-----------|--------|
| job | 3 | ATIVA |
| job_run_details | 0 | VAZIA |

**Total**: 2 tabelas, 3 registros

---

## Schema: public

| Tabela | Registros | Status |
|--------|-----------|--------|
| admin_invites | 0 | VAZIA |
| admin_users | 2 | ATIVA |
| analytics_network_summary | 1 | ATIVA |
| audit_log | 0 | VAZIA |
| bonus_transactions | 0 | VAZIA |
| bonus_wallets | 1,631 | ATIVA |
| campaign_intelligence | 0 | VAZIA |
| campaigns | 9 | ATIVA |
| cart_items | 0 | VAZIA |
| chatwoot_conversations | 0 | VAZIA |
| chatwoot_messages | 0 | VAZIA |
| commissions | 0 | VAZIA |
| customer_embeddings | 0 | VAZIA |
| customer_events | 0 | VAZIA |
| customer_metrics | 1,000 | ATIVA |
| customer_network_metrics | 1,631 | ATIVA |
| customer_plans | 1,631 | ATIVA |
| customer_predictions | 0 | VAZIA |
| customer_product_affinities | 706 | ATIVA |
| customer_qualifications | 0 | VAZIA |
| customer_scores | 1,000 | ATIVA |
| customers | 1,242 | ATIVA |
| distribuidores | 976 | ATIVA |
| distributor_themes | 1 | ATIVA |
| document_embeddings | 0 | VAZIA |
| integrations | 0 | VAZIA |
| leads | 0 | VAZIA |
| marketing_links | 0 | VAZIA |
| network_relationships | 995 | ATIVA |
| order_items | 58,801 | ATIVA |
| order_items_normalized | 1,621 | ATIVA |
| orders | 11,587 | ATIVA |
| payment_attempts | 0 | VAZIA |
| payments | 43,717 | ATIVA |
| plan_bonuses | 8 | ATIVA |
| plans | 7 | ATIVA |
| points_wallets | 1,631 | ATIVA |
| product_affinities | 260 | ATIVA |
| product_embeddings | 0 | VAZIA |
| product_metrics | 32 | ATIVA |
| product_variants | 7 | ATIVA |
| products | 112 | ATIVA |
| profiles | 7 | ATIVA |
| qualifications | 11 | ATIVA |
| referral_tracking | 0 | VAZIA |
| shipments | 20,054 | ATIVA |
| upgrade_suggestions | 0 | VAZIA |
| wallet_audit_log | 0 | VAZIA |
| wallet_transactions | 0 | VAZIA |
| wallets | 1,631 | ATIVA |
| withdrawals | 0 | VAZIA |
| workspace_settings | 7 | ATIVA |

**Total**: 48 tabelas, 164,000+ registros

---

## Schema: realtime

| Tabela | Registros | Status |
|--------|-----------|--------|
| messages | 0 | VAZIA |
| schema_migrations | 73 | ATIVA |
| subscription | 0 | VAZIA |

**Total**: 3 tabelas, 73 registros

---

## Schema: scrape_backup

| Tabela | Registros | Status |
|--------|-----------|--------|
| customers | 0 | VAZIA |
| order_items | 0 | VAZIA |
| orders | 0 | VAZIA |

**Total**: 3 tabelas, 0 registros

---

## Schema: storage

| Tabela | Registros | Status |
|--------|-----------|--------|
| buckets | 1 | ATIVA |
| buckets_analytics | 0 | VAZIA |
| buckets_vectors | 0 | VAZIA |
| migrations | 61 | ATIVA |
| objects | 1 | ATIVA |
| s3_multipart_uploads | 0 | VAZIA |
| s3_multipart_uploads_parts | 0 | VAZIA |
| vector_indexes | 0 | VAZIA |

**Total**: 8 tabelas, 62 registros

---

## Schema: supabase_migrations

| Tabela | Registros | Status |
|--------|-----------|--------|
| schema_migrations | 173 | ATIVA |

**Total**: 1 tabela, 173 registros

---

## Schema: vault

| Tabela | Registros | Status |
|--------|-----------|--------|
| secrets | 0 | VAZIA |

**Total**: 1 tabela, 0 registros

---

## Top 20 Tabelas por Volume de Dados

| Posição | Tabela | Schema | Registros |
|---------|--------|--------|-----------|
| 1 | order_items | public | 58,801 |
| 2 | payments | public | 43,717 |
| 3 | shipments | public | 20,054 |
| 4 | orders | public | 11,587 |
| 5 | bonus_calculations | backup_2026_05_28 | 4,618 |
| 6 | staging_orders | backup_2026_05_28 | 3,705 |
| 7 | customers | public | 1,242 |
| 8 | distribuidores | public | 976 |
| 9 | network_relationships | public | 995 |
| 10 | customer_network_metrics | public | 1,631 |
| 11 | customer_plans | public | 1,631 |
| 12 | wallets | public | 1,631 |
| 13 | points_wallets | public | 1,631 |
| 14 | bonus_wallets | public | 1,631 |
| 15 | customer_metrics | public | 1,000 |
| 16 | customer_scores | public | 1,000 |
| 17 | customer_product_affinities | public | 706 |
| 18 | order_items_normalized | public | 1,621 |
| 19 | schema_migrations | supabase_migrations | 173 |
| 20 | schema_migrations | auth | 76 |

---

## Tabelas Vazias (80+ tabelas)

### Analytics (3)
- ai_conversations, ai_insights, ai_messages

### Auth (15)
- audit_log_entries, custom_oauth_providers, flow_state, instances, mfa_challenges, mfa_factors, oauth_authorizations, oauth_client_states, oauth_clients, oauth_consents, saml_providers, saml_relay_states, sso_domains, sso_providers, webauthn_challenges, webauthn_credentials

### Backup_2026_05_28 (40+)
- account_transactions, accounts, ai_prompt_context, approval_requests, automations, boleto_details, bonuses, bots, chargebacks, conversation_embeddings, customer_embeddings, customer_labels, customer_plans, customer_segments, delivery_payments, gateway_webhooks, gateways, import_rows, imports, insight_embeddings, installment_rules, ledger, link_analytics, mlm_campaign_bonuses, mlm_campaign_plans, mlm_campaigns, network_nodes, payment_attempts, payment_installments, payment_methods, pix_details, plan_benefits, plan_versions, product_embeddings, shipping_events, shipping_quotes, sponsor_change_requests, staging_customers, staging_order_items, staging_orders_detalhado, transactions, user_qualifications, verification_documents, virtual_store_order_history, virtual_store_orders, wallets

### Public (20+)
- admin_invites, audit_log, bonus_transactions, campaign_intelligence, cart_items, chatwoot_conversations, chatwoot_messages, commissions, customer_embeddings, customer_events, customer_predictions, customer_qualifications, document_embeddings, integrations, leads, marketing_links, payment_attempts, product_embeddings, referral_tracking, upgrade_suggestions, wallet_audit_log, wallet_transactions, withdrawals

### Realtime (2)
- messages, subscription

### Scrape_backup (3)
- customers, order_items, orders

### Storage (5)
- buckets_analytics, buckets_vectors, s3_multipart_uploads, s3_multipart_uploads_parts, vector_indexes

### Vault (1)
- secrets

---

## Observações

1. **backup_2026_05_28** contém 50 tabelas de backup, muitas vazias
2. **scrape_backup** contém 3 tabelas vazias de backup de scrape
3. **public** é o schema principal com 48 tabelas ativas
4. **auth** contém 22 tabelas, 15 vazias (não utilizadas)
5. **analytics** contém 4 tabelas, 3 vazias (AI não implementado)
6. **Total de tabelas vazias**: 80+ tabelas
7. **Total de tabelas com dados**: ~58 tabelas

---

**Gerado em**: 8 de Junho de 2026  
**Fonte**: pg_stat_user_tables  
**Projeto**: sistema-allin
