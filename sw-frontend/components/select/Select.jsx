import { Listbox, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";

const Select = ({ data, onChange }) => {
  const [selected, setSelected] = useState(data[0]);

  const changed = (e) => {
    setSelected(e);
    onChange?.(e);
  }

  return (
    <Listbox value={selected.name} onChange={changed}>
      <div className="selector">
        <Listbox.Button>
          {/* <Image src={selected?.icon} alt="icon" /> */}
          <span>{selected?.name}</span>
        </Listbox.Button>
        <Transition as={Fragment}>
          <Listbox.Options>
            {data.map((itm) => (
              <Listbox.Option key={itm.id} value={itm}>
                {({ selected }) => (
                  <span className={selected ? "selected" : ""}>
                    {itm.name}
                    {selected}
                  </span>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};

export default Select;
