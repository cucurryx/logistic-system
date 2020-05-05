import {OrderCreateRequest} from "../common/request";
import {Timestamp} from "rxjs";

export class Storage {
    data: Array<any>;
    time: Array<any>;

    public put(order: OrderCreateRequest): string {

        return 'ok';
    }
}