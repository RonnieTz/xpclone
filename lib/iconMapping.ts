// Centralized icon mapping to ensure consistency across desktop icons, windows, and taskbar
export const getIconPath = (iconId: string): string => {
  const iconMap: { [key: string]: string } = {
    // System items
    computer: 'My Computer.png',
    'my-computer': 'My Computer.png',
    'recycle-empty': 'Recycle Bin (empty).png',
    'recycle-full': 'Recycle Bin (full).png',
    recycle: 'Recycle Bin (empty).png',

    // Folders
    folder: 'Folder Closed.png',
    'folder-desktop': 'Desktop.png',
    'folder-documents': 'My Documents.png',
    'folder-user': 'Folder Closed.png',
    'my-documents': 'My Documents.png',
    'my-pictures': 'My Pictures.png',

    // Applications
    notepad: 'Notepad.png',
    'text-file': 'Notepad.png',
    calculator: 'Calculator.png',
    paint: 'Paint.png',
    'image-file': 'Paint.png',
    ie: 'Internet Explorer.png',
    'internet-explorer': 'Internet Explorer.png',
    outlook: 'Outlook Express.png',
    email: 'Outlook Express.png',
    wmp: 'Windows Media Player.png',
    'windows-media-player': 'Windows Media Player.png',
    messenger: 'Windows Messenger.png',
    'windows-messenger': 'Windows Messenger.png',
    explorer: 'Explorer.png',
    'windows-explorer': 'Explorer.png',
    'command-prompt': 'Command Prompt.png',
    'control-panel': 'Control Panel.png',

    // File types
    'sound-file': 'Volume Control.png',
    application: 'Application.png',
    shortcut: 'Shortcut.png',
    file: 'Default.png',

    // Drives
    'drive-c': 'My Computer.png',
    drive: 'My Computer.png',

    // Games
    freecell: 'FreeCell.png',
    hearts: 'Hearts.png',
    minesweeper: 'Minesweeper.png',
    pinball: 'Pinball.png',
    'spider-solitaire': 'Spider Solitaire.png',
    solitaire: 'Solitaire.png',

    // Accessories
    wordpad: 'Wordpad.png',
    charmap: 'Charmap.png',
    backup: 'Backup Wizard.png',
    'disk-cleanup': 'Disk Cleanup.png',
    'disk-defragmenter': 'Disk Defragmenter.png',
    'system-information': 'System Information.png',
    'system-restore': 'System Restore.png',

    // Communications
    'hyper-terminal': 'Hyper Terminal.png',
    'network-connections': 'Network Connections.png',
    'network-setup': 'Network Setup.png',
    'remote-desktop': 'Remote Desktop.png',

    // Entertainment
    'sound-recorder': 'Volume Alt.png',
    'volume-control': 'Volume Level.png',

    // Special items that use name-based mapping
    'my computer': 'My Computer.png',
    'recycle bin': 'Recycle Bin (empty).png',
  };

  // First try direct mapping
  const directMapping = iconMap[iconId.toLowerCase()];
  if (directMapping) {
    return directMapping;
  }

  // For special cases like "My Computer", try to map the display name
  const nameMapping = iconMap[iconId.toLowerCase().replace(/\s+/g, '-')];
  if (nameMapping) {
    return nameMapping;
  }

  // Default fallback
  return 'Default.png';
};
