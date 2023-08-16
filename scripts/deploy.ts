import { writeFileSync } from 'fs'
import { DriveOnChainApp, Name } from '../src/contracts/driveOnChainApp'
import { privateKey } from './privateKey'
import { bsv, TestWallet, DefaultProvider, sha256, FixedArray, toByteString, PubKeyHash } from 'scrypt-ts'
import { Escrow } from '../src/contracts/Escrow'


function getScriptHash(scriptPubKeyHex: string) {
    const res = sha256(scriptPubKeyHex).match(/.{2}/g)
    if(!res) {
        throw new Error('scriptPubKeyHex is not of even length')
    }
    return res.reverse().join('')
}

async function main() {
    await DriveOnChainApp.compile()
    await Escrow.compile()

    // Prepare signer. 
    // See https://scrypt.io/docs/how-to-deploy-and-call-a-contract/#prepare-a-signer-and-provider
    const signer = new TestWallet(privateKey, new DefaultProvider({
        network: bsv.Networks.testnet
    }))

    // Adjust the amount of satoshis locked in the smart contract:
    const amount = 100

    const candidateNames: FixedArray<Name, 4> = [
        toByteString('Toyota', true),
        toByteString('BMW', true),
        toByteString('Nissan', true),
        toByteString('Mercedes', true)
    ]

    const instance = new DriveOnChainApp(
        candidateNames
    )

    // Connect to a signer.
    await instance.connect(signer)
    
    // Contract deployment.
    const deployTx = await instance.deploy(amount)

    // Save deployed contracts script hash.
    const scriptHash = getScriptHash(instance.lockingScript.toHex())
    const shFile = `.scriptHash`;
    writeFileSync(shFile, scriptHash);

    console.log('DriveOnChainApp contract was successfully deployed!')
    console.log(`TXID: ${deployTx.id}`)
    console.log(`scriptHash: ${scriptHash}`)

        // //contract 2
        const buyerPublicKeyHash = 'mxLfvwv8tYw2FtUFbFnHUgQprsGooXkQuZ';
        const buyerAddr = PubKeyHash(buyerPublicKeyHash)
        
        
        const sellerPublicKeyHash = 'mrL7WyVbjhyVsYn3WEvgtwaMCp43AHEiGU';
        const sellrAddr = PubKeyHash(sellerPublicKeyHash);
        
        const arbiterPublicKeyHash = 'mw7BPXAQpAQLPJ5zWcrsd9XH68Xwi7WBdj'
        const arbiterAddr =  PubKeyHash(arbiterPublicKeyHash);

        const instance2 = new Escrow(
            buyerAddr, 
            sellrAddr, 
            arbiterAddr,
        )
    
        // Connect to a signer.
        await instance2.connect(signer)
    
        // Contract deployment.
        const deployTx2 = await instance2.deploy(amount)
    
        // Save deployed contracts script hash.
        const scriptHash2 = getScriptHash(instance2.lockingScript.toHex())
        const shFile2 = `.scriptHash`;
        writeFileSync(shFile2, scriptHash2)
    
        console.log('EscrowApp contract was successfully deployed!')
        console.log(`TXID: ${deployTx2.id}`)
        console.log(`scriptHash: ${scriptHash2}`)
}

main()
