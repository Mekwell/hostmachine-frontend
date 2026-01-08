"use server";

import { internalFetch } from "@/lib/api";
import { revalidatePath } from "next/cache";

// --- Auth ---
export async function loginUser(data: any) {
  return await internalFetch('/auth/login', {
    method: 'POST',
    data
  });
}

export async function registerUser(data: any) {
  return await internalFetch('/auth/register', {
    method: 'POST',
    data
  });
}

// --- Plans ---
export async function getPlans() {
  try {
    return await internalFetch('/plans', { next: { revalidate: 3600 } });
  } catch (err) {
    console.error("getPlans error:", err);
    return [];
  }
}

export async function createPlan(data: any) {
  await internalFetch('/plans', { method: 'POST', data });
  revalidatePath('/admin/plans');
  revalidatePath('/store');
}

export async function deletePlan(id: string) {
  await internalFetch(`/plans/${id}`, { method: 'DELETE' });
  revalidatePath('/admin/plans');
  revalidatePath('/store');
}

// --- Billing ---
export async function subscribeToPlan(userId: string, planId: string) {
  return await internalFetch('/billing/subscribe', {
    method: 'POST',
    data: { userId, planId }
  });
}

export async function getUserSubscriptions(userId: string) {
  try {
    return await internalFetch(`/billing/subscriptions/${userId}`, { cache: 'no-store' });
  } catch (err) {
    console.error("getUserSubscriptions error:", err);
    return [];
  }
}

// --- Servers ---
export async function getServers(userId?: string) {
  try {
    const url = userId ? `/servers?userId=${userId}` : '/servers';
    return await internalFetch(url, { cache: 'no-store' });
  } catch (err) {
    console.error("getServers error:", err);
    return [];
  }
}

export async function getServer(id: string) {
  try {
    return await internalFetch(`/servers/${id}`, { cache: 'no-store' });
  } catch (err) {
    console.error("getServer error:", err);
    return null;
  }
}

export async function deployServer(userId: string, gameId: string, memoryLimitMb: number, serverName: string, location?: string, options?: { autoUpdate?: boolean, restartSchedule?: string, env?: string[] }) {
  const env = options?.env || [`SERVER_NAME=${serverName}`];
  // NOTE: Passing gameId as gameType because the controller expects it in that field for lookup
  const res = await internalFetch('/servers', {
    method: 'POST',
    data: { userId, gameType: gameId, memoryLimitMb, env, location, ...options }
  });
  revalidatePath('/dashboard/servers');
  return res;
}

export async function startServer(id: string) {
  return await internalFetch(`/servers/${id}/start`, { method: 'POST' });
}

export async function stopServer(id: string) {
  return await internalFetch(`/servers/${id}/stop`, { method: 'POST' });
}

export async function restartServer(id: string) {
  return await internalFetch(`/servers/${id}/restart`, { method: 'POST' });
}

export async function deleteServer(id: string) {
  await internalFetch(`/servers/${id}`, { method: 'DELETE' });
  revalidatePath('/admin/servers');
}

export async function getBackups(serverId: string) {
  try {
    return await internalFetch(`/backups/${serverId}`, { cache: 'no-store' });
  } catch (err) {
    console.error("getBackups error:", err);
    return [];
  }
}

export async function createBackup(serverId: string) {
  return await internalFetch(`/backups/${serverId}`, { method: 'POST' });
}

export async function restoreBackup(id: string) {
    return await internalFetch(`/backups/${id}/restore`, { method: 'POST' });
}

export async function listFiles(serverId: string, path: string = '/') {
  try {
    return await internalFetch(`/files/list?serverId=${serverId}&path=${encodeURIComponent(path)}`, { cache: 'no-store' });
  } catch (err) {
    console.error("listFiles error:", err);
    return [];
  }
}

export async function getFileContent(serverId: string, path: string) {
  return await internalFetch(`/files/read?serverId=${serverId}&path=${encodeURIComponent(path)}`, { cache: 'no-store' });
}

export async function saveFileContent(serverId: string, path: string, content: string) {
  return await internalFetch(`/files/write`, { 
    method: 'POST',
    data: { serverId, path, content }
  });
}

export async function executeCommand(serverId: string, command: string) {
  return await internalFetch(`/commands/exec/${serverId}`, {
    method: 'POST',
    data: { command }
  });
}

export async function getLogs(serverId: string) {
  try {
    return await internalFetch(`/files/logs?serverId=${serverId}`, { cache: 'no-store' });
  } catch (err) {
    return { content: 'Failed to retrieve live logs.' };
  }
}

// --- Config ---
export async function getConfig(serverId: string, filename: string) {
    try {
        return await internalFetch(`/config/${serverId}?file=${encodeURIComponent(filename)}`, { cache: 'no-store' });
    } catch (err) {
        console.error('getConfig error', err);
        return { config: {} };
    }
}

export async function saveConfig(serverId: string, filename: string, data: any) {
    return await internalFetch(`/config/${serverId}?file=${encodeURIComponent(filename)}`, {
        method: 'POST',
        data
    });
}

export async function getGameTemplate(id: string) {
    const games = await getGames() as any[];
    return games.find(g => g.id === id);
}

// --- Games ---
export async function getGames() {
  try {
    return await internalFetch('/games', { next: { revalidate: 3600 } });
  } catch (err) {
    console.error("getGames error:", err);
    return [];
  }
}

export async function getMods(serverId: string) {
  try {
    return await internalFetch(`/mods/${serverId}`, { cache: 'no-store' });
  } catch (err) {
    console.error("getMods error:", err);
    return [];
  }
}

export async function installMod(serverId: string, modId: string) {
  return await internalFetch(`/mods/${serverId}/install`, {
    method: 'POST',
    data: { modId }
  });
}

export async function uninstallMod(serverId: string, modId: string) {
  return await internalFetch(`/mods/${serverId}/${modId}`, {
    method: 'DELETE'
  });
}

// --- Schedules ---
export async function getSchedules(serverId: string) {
  try {
    return await internalFetch(`/servers/${serverId}/schedules`, { cache: 'no-store' });
  } catch (err) {
    return [];
  }
}

export async function createSchedule(serverId: string, data: any) {
  return await internalFetch(`/servers/${serverId}/schedules`, {
    method: 'POST',
    data
  });
}

export async function deleteSchedule(id: string) {
  return await internalFetch(`/servers/schedules/${id}`, {
    method: 'DELETE'
  });
}

// --- Nodes ---
export async function getNodes() {
  try {
    const res = await internalFetch('/nodes', { cache: 'no-store' });
    return Array.isArray(res) ? res : [];
  } catch (err) {
    console.error("getNodes error:", err);
    return [];
  }
}

export async function deleteNode(id: string) {
  try {
    await internalFetch(`/nodes/${id}`, { method: 'DELETE' });
    revalidatePath('/admin/nodes');
  } catch (err) {
    console.error("deleteNode error:", err);
  }
}

export async function getEnrollmentCommand() {
  try {
    return await internalFetch('/nodes/enrollment-command', { cache: 'no-store' });
  } catch (err) {
    console.error("getEnrollmentCommand error:", err);
    return { command: 'Failed to load enrollment command.' };
  }
}

export async function rebootNode(id: string) {
  return await internalFetch(`/nodes/${id}/reboot`, { method: 'POST' });
}

export async function getAdminSystemState() {
  return await internalFetch('/admin/system-state', { cache: 'no-store' });
}

export async function getAdminUsers() {
  return await internalFetch('/admin/users', { cache: 'no-store' });
}
