// Menu data structure and constants for All Programs menu
export const HOVER_DELAY = 500;
export const BUTTON_WIDTH = 240;
export const BUTTON_HEIGHT = 37;
export const MENU_POSITION = { left: 170, bottom: 58 };

export interface MenuItemData {
  text: string;
  icon: string;
  expanded?: boolean;
  id?: string;
  submenu?: {
    position: { bottom: number; left: number };
    items: MenuItemData[];
  };
}

export interface MenuData {
  topLevel: MenuItemData[];
  divider: boolean;
  programs: MenuItemData[];
}

export const MENU_DATA: MenuData = {
  topLevel: [
    {
      text: 'Set Program Access and Defaults',
      icon: '/Default Programs.png',
    },
    {
      text: 'Windows Catalog',
      icon: '/Windows Catalog.png',
    },
    {
      text: 'Windows Update',
      icon: '/Windows Update.png',
    },
  ],
  divider: true,
  programs: [
    {
      text: 'Accessories',
      icon: '/Start Menu Programs.png',
      expanded: true,
      id: 'accessories',
      submenu: {
        position: { bottom: 215, left: 240 },
        items: [
          {
            text: 'Accessibility',
            icon: '/Start Menu Programs.png',
            expanded: true,
            id: 'accessibility',
            submenu: {
              position: { bottom: 215, left: 206 },
              items: [
                {
                  text: 'Accessibility Wizard',
                  icon: '/Accessibility Wizard.png',
                },
                { text: 'Magnifier', icon: '/Magnifier.png' },
                { text: 'Narrator', icon: '/Narrator.png' },
                { text: 'On-Screen Keyboard', icon: '/On-Screen Keyboard.png' },
                { text: 'Utility Manager', icon: '/Utility Manager.png' },
              ],
            },
          },
          {
            text: 'Communications',
            icon: '/Start Menu Programs.png',
            expanded: true,
            id: 'communications',
            submenu: {
              position: { bottom: 167, left: 206 },
              items: [
                { text: 'Hyper Terminal', icon: '/Hyper Terminal.png' },
                {
                  text: 'Network Connections',
                  icon: '/Network Connections.png',
                },
                {
                  text: 'Network Setup Wizard',
                  icon: '/Network Setup.png',
                },
                {
                  text: 'New Connection Wizard',
                  icon: '/New Network Connection.png',
                },
                {
                  text: 'Remote Desktop Connection',
                  icon: '/Remote Desktop.png',
                },
                {
                  text: 'Wireless Network Setup Wizard',
                  icon: '/Wireless Network Setup.png',
                },
              ],
            },
          },
          {
            text: 'Entertainment',
            icon: '/Start Menu Programs.png',
            expanded: true,
            id: 'entertainment',
            submenu: {
              position: { bottom: 215, left: 206 },
              items: [
                { text: 'Sound Recorder', icon: '/Volume Alt.png' },
                { text: 'Volume Control', icon: '/Volume Level.png' },
                {
                  text: 'Windows Media Player',
                  icon: '/Windows Media Player.png',
                },
              ],
            },
          },
          {
            text: 'System Tools',
            icon: '/Start Menu Programs.png',
            expanded: true,
            id: 'system-tools',
            submenu: {
              position: { bottom: 47, left: 206 },
              items: [
                { text: 'Backup', icon: '/Backup Wizard.png' },
                { text: 'Character Map', icon: '/Charmap.png' },
                { text: 'Disk Cleanup', icon: '/Disk Cleanup.png' },
                { text: 'Disk Defragmenter', icon: '/Disk Defragmenter.png' },
                {
                  text: 'File and Settings Transfer Wizard',
                  icon: '/File and Settings Transfer Wizard.png',
                },
                { text: 'Scheduled Tasks', icon: '/Scheduled Tasks.png' },
                { text: 'Security Center', icon: '/Security Center.png' },
                { text: 'System Information', icon: '/System Information.png' },
                { text: 'System Restore', icon: '/System Restore.png' },
              ],
            },
          },
          { text: 'Address Book', icon: '/Address Book.png' },
          { text: 'Calculator', icon: '/Calculator.png' },
          { text: 'Command Prompt', icon: '/Command Prompt.png' },
          { text: 'Notepad', icon: '/Notepad.png' },
          { text: 'Paint', icon: '/Paint.png' },
          {
            text: 'Program Compatibility Wizard',
            icon: '/Help And Support.png',
          },
          { text: 'Ssynchronize', icon: '/Synchronize.png' },
          { text: 'Tour Windows XP', icon: '/Tour XP.png' },
          { text: 'Windows Explorer', icon: '/Explorer.png' },
          { text: 'Wordpad', icon: '/Wordpad.png' },
        ],
      },
    },
    {
      text: 'Games',
      icon: '/Start Menu Programs.png',
      expanded: true,
      id: 'games',
      submenu: {
        position: { bottom: 70, left: 240 },
        items: [
          { text: 'FreeCell', icon: '/FreeCell.png' },
          { text: 'Hearts', icon: '/Hearts.png' },
          { text: 'Minesweeper', icon: '/Minesweeper.png' },
          { text: 'Pinball', icon: '/Pinball.png' },
          { text: 'Spider Solitaire', icon: '/Spider Solitaire.png' },
          { text: 'Solitaire', icon: '/Solitaire.png' },
        ],
      },
    },
    {
      text: 'Startup',
      icon: '/Start Menu Programs.png',
      expanded: true,
      id: 'startup',
      submenu: {
        position: { bottom: 167, left: 240 },
        items: [],
      },
    },
    { text: 'Internet Explorer', icon: '/Internet Explorer.png' },
    { text: 'MSN', icon: '/MSN.png' },
    { text: 'Outlook Express', icon: '/Email.png' },
    { text: 'Remote Assistance', icon: '/Remote Assistance.png' },
    { text: 'Windows Media Player', icon: '/Windows Media Player.png' },
    { text: 'Windows Messenger', icon: '/Windows Messenger.png' },
    { text: 'Windows Movie Maker', icon: '/Windows Movie Maker.png' },
  ],
};
