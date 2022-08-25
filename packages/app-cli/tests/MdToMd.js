"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const mdImporterService = require('@joplin/lib/services/interop/InteropService_Importer_Md').default;
const Note = require('@joplin/lib/models/Note').default;
const { setupDatabaseAndSynchronizer, switchClient } = require('@joplin/lib/testing/test-utils.js');
const importer = new mdImporterService();
describe('InteropService_Importer_Md: importLocalImages', function () {
    beforeEach((done) => __awaiter(this, void 0, void 0, function* () {
        yield setupDatabaseAndSynchronizer(1);
        yield switchClient(1);
        done();
    }));
    it('should import linked files and modify tags appropriately', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const tagNonExistentFile = '![does not exist](does_not_exist.png)';
            const note = yield importer.importFile(`${__dirname}/md_to_md/sample.md`, 'notebook');
            const items = yield Note.linkedItems(note.body);
            expect(items.length).toBe(2);
            const inexistentLinkUnchanged = note.body.includes(tagNonExistentFile);
            expect(inexistentLinkUnchanged).toBe(true);
        });
    });
    it('should only create 1 resource for duplicate links, all tags should be updated', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const note = yield importer.importFile(`${__dirname}/md_to_md/sample-duplicate-links.md`, 'notebook');
            const items = yield Note.linkedItems(note.body);
            expect(items.length).toBe(1);
            const reg = new RegExp(items[0].id, 'g');
            const matched = note.body.match(reg);
            expect(matched.length).toBe(2);
        });
    });
    it('should import linked files and modify tags appropriately when link is also in alt text', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const note = yield importer.importFile(`${__dirname}/md_to_md/sample-link-in-alt-text.md`, 'notebook');
            const items = yield Note.linkedItems(note.body);
            expect(items.length).toBe(1);
        });
    });
    it('should passthrough unchanged if no links present', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const note = yield importer.importFile(`${__dirname}/md_to_md/sample-no-links.md`, 'notebook');
            const items = yield Note.linkedItems(note.body);
            expect(items.length).toBe(0);
            expect(note.body).toContain('Unidentified vessel travelling at sub warp speed, bearing 235.7. Fluctuations in energy readings from it, Captain. All transporters off.');
        });
    });
    it('should import linked image with special characters in name', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const note = yield importer.importFile(`${__dirname}/md_to_md/sample-special-chars.md`, 'notebook');
            const items = yield Note.linkedItems(note.body);
            expect(items.length).toBe(1);
        });
    });
    it('should import resources for files', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const note = yield importer.importFile(`${__dirname}/md_to_md/sample-files.md`, 'notebook');
            const items = yield Note.linkedItems(note.body);
            expect(items.length).toBe(4);
        });
    });
});
//# sourceMappingURL=MdToMd.js.map