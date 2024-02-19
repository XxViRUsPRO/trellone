import { AuditLog, Card, List, User } from "@prisma/client";

export type ListWithCards = List & { cards: Card[] };

export type CardWithList = Card & { list: List };

export type AuditLogWithUser = AuditLog & { user: User };
