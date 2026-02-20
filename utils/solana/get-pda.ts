import { PublicKey } from "@solana/web3.js";
import { action } from "@/config/contracts";

export const getPDA = (
  seeds: (Buffer | PublicKey | string)[]
): [PublicKey, number] => {
  const processedSeeds = seeds.map((s) => {
    if (s instanceof PublicKey) return s.toBuffer();
    if (typeof s === "string") return Buffer.from(s);
    return s;
  });

  return PublicKey.findProgramAddressSync(processedSeeds, action.programId);
};
