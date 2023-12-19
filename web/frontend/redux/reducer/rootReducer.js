import { combineReducers } from "redux";
import { ProductReducer } from "./ProductReducer";
import { GetUpsellReducer } from "./GetUpsellReducer";
import { AcceptOfferReducer } from "./AcceptOfferReducer";
import { AcceptUpsell } from './AcceptUpsell';
import { DeclineOfferReducer } from "./DeclineOfferReducer";
import { DeclineUpsell } from './DeclineUpsell';
import { ShowProductReducer } from "./ShowProductReducer";
import { TriggerReducer } from "./TriggerReducer";
import { EditMainProReducer } from "./EditMainProReducer";
import { EditMainUpsellReducer } from "./EditMainUpsellReducer";
import { EditAcceptProReducer } from './EditAcceptProReducer'
import { EditAcceptUpsellReducer } from './EditAcceptUpsellReducer'
import { EditDeclineProReducer } from './EditDeclineProReducer';
import { EditDeclineUpsellReducer } from './EditDeclineUpsellReducer';
import { MainDeleteReducer } from './MainDeleteReducer';

export default combineReducers(
    {
        ProductReducer,
        GetUpsellReducer,
        AcceptOfferReducer,
        AcceptUpsell,
        DeclineOfferReducer,
        DeclineUpsell,
        ShowProductReducer,
        TriggerReducer,
        EditMainProReducer,
        EditMainUpsellReducer,
        EditAcceptProReducer,
        EditAcceptUpsellReducer,
        EditDeclineProReducer,
        EditDeclineUpsellReducer,
        MainDeleteReducer
    }
)