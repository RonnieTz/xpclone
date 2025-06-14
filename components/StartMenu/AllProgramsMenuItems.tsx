import React from 'react';
import AllProgramsMenu from './AllProgramsMenu';
import ProgramMenuItem from './ProgramMenuItem';
import Divider from './Divider';
import { MENU_DATA } from './allProgramsData';

interface AllProgramsMenuItemsProps {
  onClose: () => void;
}

const AllProgramsMenuItems: React.FC<AllProgramsMenuItemsProps> = ({
  onClose,
}) => {
  return (
    <>
      {MENU_DATA.topLevel.map((item, index) => (
        <ProgramMenuItem key={index} text={item.text} icon={item.icon} />
      ))}

      {MENU_DATA.divider && (
        <Divider color="gray" position={{ left: 0, top: 0 }} />
      )}

      {MENU_DATA.programs.map((item, index) => {
        if (item.submenu) {
          return (
            <ProgramMenuItem
              key={item.id || index}
              text={item.text}
              icon={item.icon}
              expanded={item.expanded}
              id={item.id}
            >
              <AllProgramsMenu
                isVisible
                onClose={onClose}
                position={item.submenu.position}
                isSubmenu={true}
              >
                {item.submenu.items.length === 0 ? (
                  <div
                    className="mx-6 text-black text-sm "
                    style={{ height: 25, lineHeight: '25px' }}
                  >
                    (empty)
                  </div>
                ) : (
                  item.submenu.items.map((subItem, subIndex) => {
                    // Handle nested submenus (like Accessibility within Accessories)
                    if (subItem.submenu) {
                      return (
                        <ProgramMenuItem
                          key={subItem.id || subIndex}
                          text={subItem.text}
                          icon={subItem.icon}
                          expanded={subItem.expanded}
                          id={subItem.id}
                        >
                          <AllProgramsMenu
                            isVisible
                            onClose={onClose}
                            position={subItem.submenu.position}
                            isSubmenu={true}
                          >
                            {subItem.submenu.items.map(
                              (nestedItem, nestedIndex) => (
                                <ProgramMenuItem
                                  key={nestedItem.id || nestedIndex}
                                  text={nestedItem.text}
                                  icon={nestedItem.icon}
                                  expanded={nestedItem.expanded}
                                  id={nestedItem.id}
                                />
                              )
                            )}
                          </AllProgramsMenu>
                        </ProgramMenuItem>
                      );
                    }

                    return (
                      <ProgramMenuItem
                        key={subItem.id || subIndex}
                        text={subItem.text}
                        icon={subItem.icon}
                        expanded={subItem.expanded}
                        id={subItem.id}
                      />
                    );
                  })
                )}
              </AllProgramsMenu>
            </ProgramMenuItem>
          );
        }

        return (
          <ProgramMenuItem
            key={item.id || index}
            text={item.text}
            icon={item.icon}
          />
        );
      })}
    </>
  );
};

export default AllProgramsMenuItems;
