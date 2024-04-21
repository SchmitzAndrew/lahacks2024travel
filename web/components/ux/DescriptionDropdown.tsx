import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

import TTSButton from '@/components/ui/TTSButton';

function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
}

interface DropdownProps {
    description: string;
}

export default function Dropdown({ description }: DropdownProps) {
    return (
        <Menu as="div" className="mt-4 w-full inline-block text-left">
            <div>
                <Menu.Button className="pt-2 inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-9000 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                    Read Description
                    <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
                </Menu.Button>
            </div>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="z-10 mt-2 px-4 w-full origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                        <p>{description}</p>
                        <TTSButton text={description} />
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    )
}
