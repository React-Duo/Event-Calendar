import { STREET_MIN_CHARS, STREET_MAX_CHARS, COUNTRY_MIN_CHARS, COUNTRY_MAX_CHARS, CITY_MIN_CHARS, CITY_MAX_CHARS} from '../../common/constants';
import './Address.css';

const Address = () => {

    return (
        <>
            <label htmlFor="address">Address </label>
            <span className="address">
                <input type="text" name="country" id="country" placeholder="Country"/>
                <h5><i>{COUNTRY_MIN_CHARS}-{COUNTRY_MAX_CHARS} chars | upper-/lowercase | space</i></h5>

                <input type="text" name="city" id="city" placeholder="City"/>
                <h5><i>{CITY_MIN_CHARS}-{CITY_MAX_CHARS} chars | upper-/lowercase | space</i></h5>

                <input type="text" name="street" id="street" placeholder="Street"/>
                <h5><i>{STREET_MIN_CHARS}-{STREET_MAX_CHARS} chars | upper-/lowercase | digits | space | dot</i></h5>
            </span>
        </>
    )
}

export default Address;