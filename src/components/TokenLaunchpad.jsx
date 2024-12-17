import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { TOKEN_2022_PROGRAM_ID, getMintLen, createInitializeMetadataPointerInstruction, createInitializeMintInstruction, TYPE_SIZE, LENGTH_SIZE, ExtensionType, createMintToInstruction, createAssociatedTokenAccountInstruction, getAssociatedTokenAddressSync } from "@solana/spl-token";
import { createInitializeInstruction, pack } from '@solana/spl-token-metadata';
import { useState } from "react";

export function TokenLaunchpad() {
    const wallet = useWallet();
    const { connection } = useConnection();
    const [btnData,setBtnData]=useState("Create Token");



    async function createToken() {
if(btnData!="Create Token")return;


if(!wallet.publicKey)
{
    alert ("Please connect wallet !!!");
    setBtnData("Create Token")
    return
}


let f=1;
        setBtnData("Please Wait ...");
        const name = document.getElementById("name").value;
        const symbol = document.getElementById("symbol").value;
        const image = document.getElementById("image").value;
        const supply = document.getElementById("supply").value;
        
        const keypair = Keypair.generate();
        const metadata = {
            mint: keypair.publicKey,
            name: name,
            symbol: symbol,
            uri: image,
            additionalMetadata: [],
        };
        
        const mintLen = getMintLen([ExtensionType.MetadataPointer]);
        const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;
        
        const lamports = await connection.getMinimumBalanceForRentExemption(mintLen + metadataLen);
        console.log(lamports);
        
        const transaction = new Transaction().add(
            SystemProgram.createAccount({
                fromPubkey: wallet.publicKey,
                newAccountPubkey: keypair.publicKey,
                space: mintLen,
                lamports,
                programId: TOKEN_2022_PROGRAM_ID,
            }),
            createInitializeMetadataPointerInstruction(keypair.publicKey, wallet.publicKey, keypair.publicKey, TOKEN_2022_PROGRAM_ID),
            createInitializeMintInstruction(keypair.publicKey, 9, wallet.publicKey, wallet.publicKey, TOKEN_2022_PROGRAM_ID),
            createInitializeInstruction({
                programId: TOKEN_2022_PROGRAM_ID,
                mint: keypair.publicKey,
                metadata: keypair.publicKey,
                name: metadata.name,
                symbol: metadata.symbol,
                uri: metadata.uri,
                mintAuthority: wallet.publicKey,
                updateAuthority: wallet.publicKey,
            })
        );
        
        const recentBlockhash = await connection.getLatestBlockhash();
        transaction.recentBlockhash = recentBlockhash.blockhash;
        transaction.feePayer = wallet.publicKey;
        transaction.partialSign(keypair);
        setBtnData("Sign Transaction To Create Mint Account ...")
        await wallet.sendTransaction(transaction, connection)
        .then((res)=>{
            console.log(res)
        })
        .catch(()=>{
            alert("Transaction Aborted !!!!")
            setBtnData("Create Token")


            document.getElementById("name").value=""
            document.getElementById("symbol").value =""
            document.getElementById("image").value =""
            document.getElementById("supply").value =""
             f=0;
        })

        if(!f)return;
         
setBtnData("Please Wait");
const associatedToken = getAssociatedTokenAddressSync(
    keypair.publicKey,
    wallet.publicKey,
    false,
    TOKEN_2022_PROGRAM_ID
);

console.log(associatedToken.toBase58());

const transaction2 = new Transaction().add(
            createAssociatedTokenAccountInstruction(
                wallet.publicKey,
                associatedToken,
                wallet.publicKey,
                keypair.publicKey,
                TOKEN_2022_PROGRAM_ID
            )
        );
        setBtnData("Sign Transaction To Create Associated Token Account ...")
        await wallet.sendTransaction(transaction2, connection)

  .catch(()=>{
            alert("Transaction Aborted !!!!")
            setBtnData("Create Token")
            
document.getElementById("name").value=""
document.getElementById("symbol").value =""
document.getElementById("image").value =""
document.getElementById("supply").value =""

f=0;
})

if(!f)return;

        setBtnData("Please Wait");
        
        const transaction3 = new Transaction().add(
            createMintToInstruction(keypair.publicKey, associatedToken, wallet.publicKey, supply * 1e9, [], TOKEN_2022_PROGRAM_ID)
        );
        
        setBtnData("Sign Transaction To Mint "+ supply+ " Tokens ...")
        await wallet.sendTransaction(transaction3, connection)
        .catch(()=>{
            alert("Transaction Aborted !!!!")
            setBtnData("Create Token")
            
document.getElementById("name").value=""
document.getElementById("symbol").value =""
document.getElementById("image").value =""
document.getElementById("supply").value =""

f=0;
})

if(!f)return;

        setBtnData("Create Token")

document.getElementById("name").value=""
        document.getElementById("symbol").value =""
    document.getElementById("image").value =""
        document.getElementById("supply").value =""


    }

    return (
        <div className=" min-h-[50%] flex flex-col justify-center items-center bg-gradient-to-r from-blue-500 to-purple-600 p-4">
            <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full">
                <h1 className="text-xl font-bold text-center text-gray-800 mb-6">
                    Solana Token Launchpad
                </h1>
                <div className="space-y-3">
                    <input
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        type="text"
                        id="name"
                        placeholder="Token Name"
                    />
                    <input
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        type="text"
                        id="symbol"
                        placeholder="Token Symbol"
                    />
                    <input
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        type="text"
                        id="image"
                        placeholder="Image URL"
                    />
                    <input
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        type="text"
                        id="supply"
                        placeholder="Initial Supply"
                    />
                    <button
                        className="w-full bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 transition-colors"
                        onClick={() => createToken()}
                    >
                      {btnData}
                    </button>
                </div>
            </div>
        </div>
    );
}
