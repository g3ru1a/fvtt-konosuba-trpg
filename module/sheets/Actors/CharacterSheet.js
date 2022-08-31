export default class CharacterSheet extends ActorSheet {
    getData() {
        const data = super.getData();
        let sheetData = {
            owner: this.actor.isOwner,
            editable: this.isEditable,
            actor: this.actor,
            data: data.actor.data.data,
            race: data.items.find(function (item) {
                return item.type == "race";
            }),
            class: data.items.find(function (item) {
                return item.type == "class";
            }),
            config: CONFIG.konosuba,
        };
        return sheetData;
    }

    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: "systems/konosuba/templates/sheets/character-sheet.hbs",
            classes: ["konosuba", "character-sheet"],
            tabs: [{ navSelector: ".tabs", contentSelector: ".sheet-body", initial: "description" }],
            width: 860,
            height: 1200,
        });
    }

    activateListeners(html) {
        if (this.isEditable) {
            html.find(".item-edit").click(this._onItemSelect.bind(this));
            html.find(".delete-icon").click(this._onItemRemove.bind(this));
        }

        super.activateListeners(html);
    }

    _onItemSelect(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.dataset.itemId;
        let item = this.actor.items.get(itemId);
        if (item == undefined) {
            console.warn("Konosuba | Undefined Item");
            return;
        }
        item.sheet.render(true);
        return;
    }

    _onItemRemove(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.dataset.itemId;
        let item = this.actor.items.get(itemId);
        item.delete();
        // this.actor.sheet.render(true);
    }

    /** @override */
    async _onDropItemCreate(itemData) {
        let items = itemData instanceof Array ? itemData : [itemData];
        let actor = this.actor;

        //Allow only one race at a time
        let hasRace = actor.items.filter((item) => item.type == "race").length > 0;
        console.log(hasRace);
        if (hasRace) {
            items = items.filter((item) => item.type != "race");
        }

        // Create the owned items as normal
        return this.actor.createEmbeddedDocuments("Item", items);
    }
}
