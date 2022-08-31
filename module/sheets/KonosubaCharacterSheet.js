export default class KonosubaCharacterSheet extends ActorSheet {
    get template() {
        return `systems/konosuba/templates/sheets/${this.actor.data.type}-sheet.hbs`;
    }

    getData() {
        const data = super.getData();
        let sheetData = {
            owner: this.actor.isOwner,
            editable: this.isEditable,
            actor: this.actor,
            data: data.actor.data.data,
            config: CONFIG.konosuba,
        };
        return sheetData;
    }

    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["character-sheet"],
            tabs: [{ navSelector: ".tabs", contentSelector: ".sheet-body", initial: "description" }],
            width: 860,
            height: 1200,
        });
    }
}
