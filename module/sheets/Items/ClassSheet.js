import CharacterSheet from "../Actors/CharacterSheet.js";

export default class ClassSheet extends ItemSheet {

    getData() {
        const data = super.getData();
        let parent = this.item.parent;
        console.log(data.item.data.data.isStartingClass);
        if (parent && data.item.data.data.isStartingClass) {
            let key = Object.keys(parent.apps)[0];
            let app = parent.apps[key];
            if (app instanceof CharacterSheet) {
                console.log("Konosuba | Updated HP MP");
                app.updateBaseHPMP();
            }
        }
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
            template: "systems/konosuba/templates/sheets/class-sheet.hbs",
            classes: ["konosuba", "class-sheet"],
            width: 720,
            height: 450
        });
    }
}