import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
} from 'firebase/firestore'

import { getDb, isLive } from '@/services/firebase/client'
import { NotConfiguredError } from '@/services/firebase/errors'
import { bool, num, str, updateTimestamp } from '@/services/firebase/converters'
import { COLLECTIONS } from '@/models/collections'
import type { TeamMember, TeamMemberInput, TeamRoleKey } from '@/models/team'
import { SEED_TEAM } from '@/data/seed/team'
import { deleteFile } from '@/repositories/storage'

/**
 * Team members.
 *
 * Reads fall back to the seed when Firebase is unconfigured or the collection
 * is empty, so the section always renders six people rather than collapsing to
 * nothing before the first admin edit.
 */

function mapMember(id: string, data: Record<string, unknown>): TeamMember {
  return {
    id,
    name: str(data.name),
    roleKey: str(data.roleKey, 'backendEngineer') as TeamRoleKey,
    roleOverride: str(data.roleOverride),
    bio: str(data.bio),
    photoUrl: str(data.photoUrl),
    photoPath: str(data.photoPath),
    linkedinUrl: str(data.linkedinUrl),
    order: num(data.order, 99),
    published: bool(data.published, true),
    placeholder: bool(data.placeholder),
  }
}

export async function listTeam(includeUnpublished = false): Promise<TeamMember[]> {
  const fallback = includeUnpublished ? SEED_TEAM : SEED_TEAM.filter((m) => m.published)
  if (!isLive()) return fallback

  try {
    const snapshot = await getDocs(
      query(collection(getDb(), COLLECTIONS.team), orderBy('order', 'asc')),
    )
    if (snapshot.empty) return fallback

    const all = snapshot.docs.map((document) => mapMember(document.id, document.data()))
    return includeUnpublished ? all : all.filter((member) => member.published)
  } catch {
    // The team section is never worth failing a page render over.
    return fallback
  }
}

export async function saveTeamMember(input: TeamMemberInput, id?: string): Promise<string> {
  if (!isLive()) throw new NotConfiguredError('Team management')

  const reference = id
    ? doc(getDb(), COLLECTIONS.team, id)
    : doc(collection(getDb(), COLLECTIONS.team))

  await setDoc(reference, { ...input, ...updateTimestamp() }, { merge: true })
  return reference.id
}

/** Removes the member and their portrait, so Storage keeps no orphans. */
export async function deleteTeamMember(id: string, photoPath?: string): Promise<void> {
  if (!isLive()) throw new NotConfiguredError('Team management')

  if (photoPath) await deleteFile(photoPath)
  await deleteDoc(doc(getDb(), COLLECTIONS.team, id))
}
