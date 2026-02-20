import {
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";
import * as anchor from "@coral-xyz/anchor";

export const getATA = (
  mint: anchor.web3.PublicKey,
  owner: anchor.web3.PublicKey,
  isToken2022: boolean = false
): anchor.web3.PublicKey => {
  return getAssociatedTokenAddressSync(
    mint,
    owner,
    true, // true por defecto para soportar PDAs como owners
    isToken2022 ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID
  );
};