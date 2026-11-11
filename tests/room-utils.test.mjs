import assert from 'node:assert/strict';
import { pdfRoomId, validRoomId, otherReaderCount } from '../js/room-utils.js';

const a = new TextEncoder().encode('%PDF-1.4 reading A');
const b = new TextEncoder().encode('%PDF-1.4 reading B');
assert.equal(await pdfRoomId(a), await pdfRoomId(a), 'Same PDF must share a room');
assert.notEqual(await pdfRoomId(a), await pdfRoomId(b), 'Different PDFs must use separate rooms');
assert(validRoomId(await pdfRoomId(a)));
assert(validRoomId('general'));
for (const invalid of ['../private', 'pdf-123', '', 'random-room']) assert(!validRoomId(invalid));
const now = Date.now();
assert.equal(otherReaderCount([
    {uid: 'me', lastSeen: now},
    {uid: 'peer', lastSeen: now},
    {uid: 'peer', lastSeen: now},
    {uid: 'gone', lastSeen: now - 90000},
    {uid: 'future', lastSeen: now + 60000},
    {uid: 'pending'}
], 'me', now), 1, 'Count distinct other readers and exclude expired/invalid timestamps');
assert.equal(otherReaderCount([], 'me', now), 0);
console.log('Room matching and presence tests passed.');
