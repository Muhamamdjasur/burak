import ViewModel from "../schema/View.model";


class ViewSevice {
    private readonly viewModel;

    constructor() {
        this.viewModel = ViewModel;
    }

}

export default new ViewSevice();