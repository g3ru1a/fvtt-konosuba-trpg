export default class RaceSheet extends ItemSheet {

    getData() {
        const data = super.getData();
        let sheetData = {
            owner: this.item.isOwner,
            editable: this.isEditable,
            item: this.item,
            data: data.item.data.data,
            config: CONFIG.konosuba,
        };
        return sheetData;
    }

    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: "systems/konosuba/templates/sheets/race-sheet.hbs",
            classes: ["konosuba", "race-sheet"],
            width: 720,
            height: 320
        });
    }
}