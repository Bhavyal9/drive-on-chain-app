import {
    assert,
    method,
    prop,
    PubKeyHash,
    PubKey,
    SmartContract,
    Sig,
    hash160,
    SigHash,
    Utils,
    hash256,
} from 'scrypt-ts'


export class Escrow extends SmartContract {
    @prop()
    readonly buyerAddr: PubKeyHash

    @prop()
    readonly sellerAddr: PubKeyHash

    @prop()
    readonly arbiterAddr: PubKeyHash

    constructor(
        buyerAddr: PubKeyHash,
        sellerAddr: PubKeyHash,
        arbiterAddr: PubKeyHash,
    ) {
        super(...arguments)
        this.buyerAddr = buyerAddr
        this.sellerAddr = sellerAddr
        this.arbiterAddr = arbiterAddr
        
    }

    @method(SigHash.ANYONECANPAY_SINGLE)
    public confirmDeposit(
        buyerSig: Sig,
        buyerPubKey: PubKey,
        arbiterSig: Sig,
        arbiterPubKey : PubKey
    ) 
    {
        // Validate buyer sig.
        assert(
            hash160(buyerPubKey) === this.buyerAddr,
            'invalid public key for buyer'
        )
        assert(
            this.checkSig(buyerSig, buyerPubKey),
            'buyer signature check failed'
        )
        
        // Validate seller sig.
        assert(
            hash160(arbiterPubKey) === this.sellerAddr,
            'invalid public key for seller'
        )
        assert(
            this.checkSig(arbiterSig, arbiterPubKey),
            'seller signature check failed'
        )

    
        // Ensure seller gets paid.
        const amount = this.ctx.utxo.value
        const out = Utils.buildPublicKeyHashOutput(this.sellerAddr, amount)
        assert(hash256(out) === this.ctx.hashOutputs, 'hashOutputs mismatch')
    }

    

    // @method(SigHash.ANYONECANPAY_SINGLE)
    // public confirmDeposit(
    //     buyerSig: Sig,
    //     buyerPubKey: PubKey,
    //     arKey: PubKey,
    //     arbiterSig: Sig
        
    // ) {
    //     console.log(buyerPubKey,hash160(buyerPubKey),this.buyerAddr)
    //     // Validate buyer sig.
    //     assert(
    //        hash160(buyerPubKey) === this.buyerAddr,
    //         'invalid public key for buyer'
    //     )
    //     assert(
    //         this.checkSig(buyerSig, buyerPubKey),
    //         'buyer signature check failed'
    //     )
        
    //     // Validate arbiter sig.
    //     assert(
    //         hash160(arKey) === this.arbiterAddr,
    //         'invalid public key for arbiter'
    //     )
    //     assert(
    //         this.checkSig(arbiterSig, arKey),
    //         'arbiter signature check failed'
    //     )


    //     // Ensure arbiter gets paid.
    //     const amount = this.ctx.utxo.value
    //     const out = Utils.buildPublicKeyHashOutput(this.arbiterAddr, amount)
    //     assert(hash256(out) === this.ctx.hashOutputs, 'hashOutputs mismatch')
    // }

    @method(SigHash.ANYONECANPAY_SINGLE)
    public confirmPayment(
        buyerSig: Sig,
        buyerPubKey: PubKey,
        sellerSig: Sig,
        sellerPubKey : PubKey
    ) 
    {
        // Validate buyer sig.
        assert(
            hash160(buyerPubKey) === this.buyerAddr,
            'invalid public key for buyer'
        )
        assert(
            this.checkSig(buyerSig, buyerPubKey),
            'buyer signature check failed'
        )
        
        // Validate seller sig.
        assert(
            hash160(sellerPubKey) === this.sellerAddr,
            'invalid public key for seller'
        )
        assert(
            this.checkSig(sellerSig, sellerPubKey),
            'seller signature check failed'
        )

    
        // Ensure seller gets paid.
        const amount = this.ctx.utxo.value
        const out = Utils.buildPublicKeyHashOutput(this.sellerAddr, amount)
        assert(hash256(out) === this.ctx.hashOutputs, 'hashOutputs mismatch')
    }

    @method(SigHash.ANYONECANPAY_SINGLE)
    public refund(
        buyerSig: Sig,
        buyerPubKey: PubKey,
        arbiterSig: Sig,
        arbiterPubKey : PubKey
    ) 
    {
        // Validate buyer sig.
        assert(
            hash160(buyerPubKey) === this.buyerAddr,
            'invalid public key for buyer'
        )
        assert(
            this.checkSig(buyerSig, buyerPubKey),
            'buyer signature check failed'
        )
        
        // Validate arbiter sig.
        assert(
            hash160(arbiterPubKey) === this.sellerAddr,
            'invalid public key for seller'
        )
        assert(
            this.checkSig(arbiterSig, arbiterPubKey),
            'seller signature check failed'
        )

    
        // Ensure seller gets paid.
        const amount = this.ctx.utxo.value
        const out = Utils.buildPublicKeyHashOutput(this.arbiterAddr, amount)
        assert(hash256(out) === this.ctx.hashOutputs, 'hashOutputs mismatch')
    }

}