export default class KonosubaItemSheet extends ItemSheet {
    get template() {
        return `systems/konosuba/templates/sheets/${this.item.data.type}-sheet.hbs`;
    }

    getData(){
        const data = super.getData();
        let sheetData = {
            owner: this.item.isOwner,
            editable: this.isEditable,
            item: this.item,
            data: data.item.data.data,
            config: CONFIG.konosuba
        }
        return sheetData;
    }
}