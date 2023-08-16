import {
    assert,
    ByteString,
    method,
    prop,
    sha256,
    Sha256,
    SmartContract,
} from 'scrypt-ts'

export type Message = ByteString

export class BookingDetails extends SmartContract {
    @prop()
    hash: Sha256

    constructor(hash: Sha256) {
        super(...arguments)
        this.hash = hash
    }

    @method()
    public unlock(message: ByteString) {
        assert(sha256(message) == this.hash, 'Hash does not match')
    }
}
