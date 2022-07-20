import db from "../src/onedb";
import { suite, test } from "@testdeck/mocha";
import * as _chai from "chai";

_chai.should();

@suite
class OneDB {
    private SUT: db;
    private path: string;

    before() {
        this.path = "./test/db";
        this.SUT = new db(this.path);
    }
    // @test "Cat is created"() {
    //   this.SUT.path.should.to.not.be.undefined.and.have
    //     .property("path")
    //     .equal("Tom");
    // }
    @test "get collection"() {
        let collection = this.SUT.collection(
            "batch_document_insert_collection_safe"
        );
        //   let catMove = this.SUT.move(10);
        _chai.expect(collection).to.not.be.equal(null);
        _chai.expect(this.SUT.err).to.be.equal(null);
    }
    @test "get short collection error"() {
        let collection = this.SUT.collection("");

        _chai.expect(collection).to.be.equal(null);
        _chai.expect(this.SUT.err).to.not.be.equal(null);
    }
}
