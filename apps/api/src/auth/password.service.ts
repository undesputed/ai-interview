import { Injectable } from '@nestjs/common';
import { hash, verify } from '@node-rs/argon2';

/**
 * Argon2id — OWASP-recommended password hash.
 *
 * Parameters follow OWASP Password Storage Cheat Sheet (2024):
 *  - memoryCost: 64 MiB (m = 65536)
 *  - timeCost:   3 iterations (t)
 *  - parallelism: 1 (p)
 *  - hashLength: 32 bytes
 *
 * @node-rs/argon2 is a pure Rust binding with prebuilt binaries — no native
 * toolchain needed inside Alpine images.
 */
@Injectable()
export class PasswordService {
  // @node-rs/argon2 defaults `algorithm` to Argon2id — explicitly leaving it
  // off so isolatedModules doesn't complain about ambient const enum import.
  private readonly opts = {
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 1,
    outputLen: 32,
  } as const;

  hash(plaintext: string): Promise<string> {
    return hash(plaintext, this.opts);
  }

  /**
   * Constant-time-ish verify. We always run a dummy verify when the user is
   * missing to keep the request timing roughly equal, defending against email
   * enumeration via timing side-channels.
   */
  async verify(hashStr: string | null, plaintext: string): Promise<boolean> {
    if (!hashStr) {
      // Dummy hash with the same cost — keeps timing comparable.
      const dummy =
        '$argon2id$v=19$m=65536,t=3,p=1$ZHVtbXlzYWx0c2FsdHNhbHRzYWw$' +
        'RmFrZUhhc2hGYWtlSGFzaEZha2VIYXNoRmFrZUhhc2hGYWtlSGE';
      try {
        await verify(dummy, plaintext);
      } catch {
        /* swallow */
      }
      return false;
    }
    try {
      return await verify(hashStr, plaintext);
    } catch {
      return false;
    }
  }
}
