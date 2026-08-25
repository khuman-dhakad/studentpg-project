'use client';

import {
  useRouter,
  useSearchParams,
} from 'next/navigation';

import {
  Suspense,
  useEffect,
  useState,
} from 'react';

import {
  SlidersHorizontal,
  MapPin,
  IndianRupee,
  Users,
  Wifi,
  Utensils,
  Car,
  Shirt,
  RotateCcw,
  X,
  Snowflake,
  BatteryCharging,
} from 'lucide-react';


// =======================================================
// INNER FILTER COMPONENT
// =======================================================

function FilterContent() {


  // =====================================================
  // NAVIGATION
  // =====================================================

  const router =
    useRouter();


  const params =
    useSearchParams();


  // =====================================================
  // STATE
  // =====================================================

  const [

    isOpen,

    setIsOpen,

  ] = useState(false);


  const [

    city,

    setCity,

  ] = useState('');


  const [

    maxRent,

    setMaxRent,

  ] = useState('');


  const [

    category,

    setCategory,

  ] = useState('');


  const [

    food,

    setFood,

  ] = useState(false);


  const [

    wifi,

    setWifi,

  ] = useState(false);


  const [

    parking,

    setParking,

  ] = useState(false);


  const [

    laundry,

    setLaundry,

  ] = useState(false);


  const [

    ac,

    setAc,

  ] = useState(false);


  const [

    powerBackup,

    setPowerBackup,

  ] = useState(false);


  // =====================================================
  // SYNC STATE FROM URL
  // =====================================================

  useEffect(() => {


    setCity(
      params.get('city') || ''
    );


    setMaxRent(
      params.get('maxRent') || ''
    );


    setCategory(
      params.get('category') || ''
    );


    setFood(
      params.get('food') === 'true'
    );


    setWifi(
      params.get('wifi') === 'true'
    );


    setParking(
      params.get('parking') === 'true'
    );


    setLaundry(
      params.get('laundry') === 'true'
    );


    setAc(
      params.get('ac') === 'true'
    );


    setPowerBackup(
      params.get('powerBackup') === 'true'
    );


  }, [

    params,

  ]);


  // =====================================================
  // APPLY FILTERS
  // =====================================================

  const apply = () => {


    const next =
      new URLSearchParams(
        params.toString()
      );


    // Keep search query.
    // Remove old filter values first.

    next.delete('city');

    next.delete('maxRent');

    next.delete('category');

    next.delete('food');

    next.delete('wifi');

    next.delete('parking');

    next.delete('laundry');

    next.delete('ac');

    next.delete('powerBackup');


    if (

      city.trim()

    ) {

      next.set(
        'city',
        city.trim()
      );

    }


    if (

      maxRent

    ) {

      next.set(
        'maxRent',
        maxRent
      );

    }


    if (

      category

    ) {

      next.set(
        'category',
        category
      );

    }


    if (

      food

    ) {

      next.set(
        'food',
        'true'
      );

    }


    if (

      wifi

    ) {

      next.set(
        'wifi',
        'true'
      );

    }


    if (

      parking

    ) {

      next.set(
        'parking',
        'true'
      );

    }


    if (

      laundry

    ) {

      next.set(
        'laundry',
        'true'
      );

    }


    if (

      ac

    ) {

      next.set(
        'ac',
        'true'
      );

    }


    if (

      powerBackup

    ) {

      next.set(
        'powerBackup',
        'true'
      );

    }


    const queryString =
      next.toString();


    router.push(

      queryString

        ? `/search?${queryString}`

        : '/search'

    );


    setIsOpen(
      false
    );

  };


  // =====================================================
  // RESET
  // =====================================================

  const clearAll = () => {


    setCity('');

    setMaxRent('');

    setCategory('');

    setFood(false);

    setWifi(false);

    setParking(false);

    setLaundry(false);

    setAc(false);

    setPowerBackup(false);


    router.push(
      '/search'
    );


    setIsOpen(
      false
    );

  };


  // =====================================================
  // AMENITY COMPONENT
  // =====================================================

  const AmenityToggle = ({

    checked,

    onChange,

    icon,

    label,

  }: {

    checked: boolean;

    onChange: (
      checked: boolean
    ) => void;

    icon: React.ReactNode;

    label: string;

  }) => (

    <label

      className={`

        flex

        cursor-pointer

        items-center

        justify-between

        rounded-xl

        border

        p-3

        transition-all

        ${

          checked

            ? 'border-indigo-600 bg-indigo-50/20'

            : 'border-slate-100 bg-slate-50/30 hover:bg-slate-50/80'

        }

      `}

    >

      <div

        className="
          flex
          items-center
          gap-2.5
          text-xs
          font-bold
          text-slate-800
        "

      >

        <span

          className={

            checked

              ? 'text-indigo-600'

              : 'text-slate-400'

          }

        >

          {icon}

        </span>


        <span>

          {label}

        </span>

      </div>


      <input

        type="checkbox"

        checked={checked}

        onChange={(event) =>

          onChange(
            event.target.checked
          )

        }

        className="
          h-4
          w-4
          rounded
          border-slate-300
          text-indigo-600
          focus:ring-indigo-500
        "

      />

    </label>

  );


  // =====================================================
  // FORM
  // =====================================================

  const FilterForm = () => (

    <div

      className="
        space-y-5
      "

    >


      {/* CITY */}

      <div

        className="
          space-y-1.5
        "

      >

        <label

          className="
            flex
            items-center
            gap-1.5
            text-xs
            font-black
            tracking-wide
            text-slate-700
          "

        >

          <MapPin

            className="
              h-3.5
              w-3.5
              text-slate-400
            "

          />

          City Location

        </label>


        <input

          value={city}

          onChange={(event) =>

            setCity(
              event.target.value
            )

          }

          placeholder="e.g. Bhopal"

          className="
            w-full
            rounded-xl
            border
            border-slate-200
            bg-slate-50/50
            px-3.5
            py-2.5
            text-xs
            font-semibold
            outline-none
            transition-all
            placeholder:text-slate-400
            focus:border-indigo-600
            focus:bg-white
            focus:ring-2
            focus:ring-indigo-600/5
          "

        />

      </div>


      {/* RENT */}

      <div

        className="
          space-y-1.5
        "

      >

        <label

          className="
            flex
            items-center
            gap-1.5
            text-xs
            font-black
            tracking-wide
            text-slate-700
          "

        >

          <IndianRupee

            className="
              h-3.5
              w-3.5
              text-slate-400
            "

          />

          Maximum Budget

        </label>


        <input

          type="number"

          min="0"

          value={maxRent}

          onChange={(event) =>

            setMaxRent(
              event.target.value
            )

          }

          placeholder="Max monthly rent"

          className="
            w-full
            rounded-xl
            border
            border-slate-200
            bg-slate-50/50
            px-3.5
            py-2.5
            text-xs
            font-semibold
            outline-none
            transition-all
            placeholder:text-slate-400
            focus:border-indigo-600
            focus:bg-white
            focus:ring-2
            focus:ring-indigo-600/5
          "

        />

      </div>


      {/* CATEGORY */}

      <div

        className="
          space-y-1.5
        "

      >

        <label

          className="
            flex
            items-center
            gap-1.5
            text-xs
            font-black
            tracking-wide
            text-slate-700
          "

        >

          <Users

            className="
              h-3.5
              w-3.5
              text-slate-400
            "

          />

          Sharing / Category

        </label>


        <select

          value={category}

          onChange={(event) =>

            setCategory(
              event.target.value
            )

          }

          className="
            w-full
            cursor-pointer
            rounded-xl
            border
            border-slate-200
            bg-slate-50/50
            px-3.5
            py-2.5
            text-xs
            font-semibold
            text-slate-800
            outline-none
            transition-all
            focus:border-indigo-600
          "

        >

          <option value="">
            Any Gender / All
          </option>

          <option value="MALE">
              Boys Only
          </option>

          <option value="FEMALE">
              Girls Only
          </option>

          <option value="UNISEX">
              Unisex
          </option>

        </select>

      </div>


      {/* AMENITIES */}

      <div

        className="
          space-y-2.5
          pt-2
        "

      >

        <label

          className="
            mb-1
            block
            text-xs
            font-black
            tracking-wide
            text-slate-700
          "

        >

          Required Amenities

        </label>


        <AmenityToggle

          checked={wifi}

          onChange={setWifi}

          icon={
            <Wifi className="h-4 w-4" />
          }

          label="High-speed Wi-Fi"

        />


        <AmenityToggle

          checked={food}

          onChange={setFood}

          icon={
            <Utensils className="h-4 w-4" />
          }

          label="Meals / Food"

        />


        <AmenityToggle

          checked={parking}

          onChange={setParking}

          icon={
            <Car className="h-4 w-4" />
          }

          label="Reserved Parking"

        />


        <AmenityToggle

          checked={laundry}

          onChange={setLaundry}

          icon={
            <Shirt className="h-4 w-4" />
          }

          label="Laundry Service"

        />


        <AmenityToggle

          checked={ac}

          onChange={setAc}

          icon={
            <Snowflake className="h-4 w-4" />
          }

          label="Air Conditioner (AC)"

        />


        <AmenityToggle

          checked={powerBackup}

          onChange={setPowerBackup}

          icon={
            <BatteryCharging className="h-4 w-4" />
          }

          label="24x7 Power Backup"

        />

      </div>


      {/* APPLY */}

      <div

        className="
          border-t
          border-slate-100
          pt-4
        "

      >

        <button

          type="button"

          onClick={apply}

          className="
            w-full
            rounded-xl
            bg-teal-600
            py-3
            text-xs
            font-black
            uppercase
            tracking-wider
            text-white
            shadow-sm
            transition-all
            hover:bg-teal-700
            active:scale-[0.98]
          "

        >

          Apply Filters

        </button>

      </div>

    </div>

  );


  // =====================================================
  // UI
  // =====================================================

  return (

    <>


      {/* ================================================
          DESKTOP FILTER
      ================================================= */}

      <div

        className="
          hidden
          w-full
          bg-white
          antialiased
          lg:block
        "

      >

        <div

          className="
            mb-5
            flex
            items-center
            justify-between
            border-b
            border-slate-100
            pb-4
          "

        >

          <div

            className="
              flex
              items-center
              gap-2
            "

          >

            <SlidersHorizontal

              className="
                h-4
                w-4
                text-indigo-600
              "

            />

            <span

              className="
                text-sm
                font-black
                tracking-tight
                text-slate-900
              "

            >

              Refine Options

            </span>

          </div>


          <button

            type="button"

            onClick={clearAll}

            className="
              inline-flex
              items-center
              gap-1
              text-[11px]
              font-bold
              text-slate-400
              transition-colors
              hover:text-rose-500
            "

          >

            <RotateCcw

              className="
                h-3
                w-3
              "

            />

            Reset

          </button>

        </div>


        <FilterForm />

      </div>


      {/* ================================================
          MOBILE FILTER BUTTON
      ================================================= */}

      <div

        className="
          fixed
          bottom-6
          left-1/2
          z-[60]
          -translate-x-1/2
          lg:hidden
        "

      >

        <button

          type="button"

          onClick={() =>
            setIsOpen(true)
          }

          className="
            flex
            items-center
            gap-2
            rounded-full
            border
            border-slate-800
            bg-slate-950
            px-6
            py-3.5
            text-xs
            font-black
            uppercase
            tracking-wider
            text-white
            shadow-2xl
            transition-transform
            active:scale-95
          "

        >

          <SlidersHorizontal

            className="
              h-3.5
              w-3.5
              text-teal-400
            "

          />

          Filters

        </button>

      </div>


      {/* ================================================
          MOBILE DRAWER
      ================================================= */}

      {isOpen && (

        <div

          className="
            fixed
            inset-0
            z-[70]
            bg-slate-900/40
            backdrop-blur-sm
          "

          onClick={() =>
            setIsOpen(false)
          }

        >

          <div

            className="
              absolute
              inset-x-0
              bottom-0
              max-h-[85vh]
              overflow-y-auto
              rounded-t-[32px]
              bg-white
              p-6
              shadow-2xl
            "

            onClick={(event) =>
              event.stopPropagation()
            }

          >

            <div

              className="
                mx-auto
                mb-4
                h-1
                w-12
                rounded-full
                bg-slate-200
              "

            />


            <div

              className="
                mb-5
                flex
                items-center
                justify-between
                border-b
                border-slate-100
                pb-4
              "

            >

              <span

                className="
                  text-base
                  font-black
                  tracking-tight
                  text-slate-900
                "

              >

                Filter Stays

              </span>


              <div

                className="
                  flex
                  items-center
                  gap-4
                "

              >

                <button

                  type="button"

                  onClick={clearAll}

                  className="
                    text-xs
                    font-bold
                    text-rose-500
                  "

                >

                  Reset

                </button>


                <button

                  type="button"

                  onClick={() =>
                    setIsOpen(false)
                  }

                  aria-label="
                    Close filters
                  "

                  className="
                    rounded-full
                    bg-slate-100
                    p-1
                    text-slate-500
                  "

                >

                  <X

                    className="
                      h-4
                      w-4
                    "

                  />

                </button>

              </div>

            </div>


            <FilterForm />

          </div>

        </div>

      )}

    </>

  );

}


// =======================================================
// EXPORT
// =======================================================

export function ListingFilters() {

  return (

    <Suspense

      fallback={

        <div

          className="
            h-48
            w-full
            animate-pulse
            rounded-2xl
            bg-slate-100
          "

        />

      }

    >

      <FilterContent />

    </Suspense>

  );

}