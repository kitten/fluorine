import { Observable } from 'rxjs/Observable'
import distinctSelector from './distinctSelector'

Observable.prototype.distinctSelector = distinctSelector
