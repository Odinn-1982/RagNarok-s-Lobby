# RagNarok's Lobby

A **system-agnostic** Foundry VTT module that allows Game Masters to prevent players from accessing the world during maintenance, session prep, or other administrative tasks.

## Features

✨ **Full-Screen Maintenance Overlay** - Players see a professional, animated maintenance message instead of the world
🔒 **Player Access Prevention** - Disables all interactive UI elements for players while lobby is active
⏱️ **Persistent State** - Lobby state persists across page reloads until the GM toggles it off
🎨 **Beautiful UI** - Smooth animations and gradient design with loading indicator
⚙️ **System Agnostic** - Works with any Foundry VTT system (D&D 5e, Pathfinder, etc.)
🔄 **Real-Time Updates** - Uses Foundry's socket system to instantly update all connected players
🎛️ **Easy Toggle** - Quick button in the top bar for instant access
📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile

## Compatibility

- **Foundry VTT**: v12 - v13
- **Systems**: All (system-agnostic)
- **Languages**: English (extensible)

## Installation

### Automatic Installation (Recommended)
1. In Foundry VTT, go to **Add-on Modules**
2. Click **Install Module**
3. Search for "RagNarok's Lobby"
4. Click **Install**

### Manual Installation
1. Download the latest release from GitHub
2. Extract the folder to `Data/modules/ragnaroks-lobby`
3. Enable the module in your world settings
4. Restart Foundry VTT

## Usage

### Activating the Lobby

As a Game Master, you have two easy ways to toggle the lobby:

#### Method 1: Sidebar Control Button (Easiest & Recommended)
- Look in the left sidebar controls (where you find walls, lighting, etc.)
- You'll see a new **"Maintenance Lobby"** control group with a door icon 🚪
- Click the toggle button to activate/deactivate the lobby
- The button will highlight in red when the lobby is active
- Hover over it to see the tooltip

#### Method 2: Console Command
```javascript
// Activate lobby
await game.settings.set("ragnaroks-lobby", "lobbyActive", true);

// Deactivate lobby
await game.settings.set("ragnaroks-lobby", "lobbyActive", false);

// Check current state
game.settings.get("ragnaroks-lobby", "lobbyActive");
```

### What Players See

When the lobby is **ACTIVE**:
- Full-screen overlay appears
- Shows "MAINTENANCE IN PROGRESS" message
- Displays animated loading dots
- All UI elements are disabled
- Cannot interact with the world in any way
- Message automatically updated in real-time across all connected players

When the lobby is **INACTIVE**:
- Overlay disappears smoothly
- Players can interact with the world normally
- All UI elements are re-enabled

## How It Works

1. **GM Activation**: GM clicks the toggle button or adjusts settings
2. **Socket Broadcasting**: Foundry's socket system broadcasts the state to all connected players
3. **Immediate Response**: Players instantly see the overlay (or it disappears if deactivated)
4. **Persistent Storage**: State is saved as a world setting
5. **Reload Protection**: If anyone reloads while lobby is active, it remains active on reconnect

## Customization

### Change the Maintenance Message

Edit `lang/en.json` and modify these strings:

```json
"game.messages.ragnaroks-lobby.maintenance-title": "YOUR CUSTOM TITLE",
"game.messages.ragnaroks-lobby.maintenance-message": "YOUR CUSTOM MESSAGE"
```

### Customize Colors and Styling

Edit `styles/lobby.css` to change:
- Overlay background gradient
- Title color and gradient
- Animation speeds
- Button styles
- Dot loading indicator

#### Example: Darker Theme
```css
#ragnaroks-lobby-overlay {
  background: linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%);
}
```

#### Example: Blue Theme
```css
.ragnaroks-lobby-title {
  background: linear-gradient(45deg, #6b9eff, #5a8aee, #4975c0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.ragnaroks-lobby-dots span {
  background: linear-gradient(45deg, #6b9eff, #5a8aee);
}
```

## Configuration

### Module Settings

**Activate Maintenance Lobby** (World Setting)
- Enable/Disable the maintenance lobby state
- Scoped to world (shared across all players in that world)
- Persists until manually toggled off

## Troubleshooting

### The overlay doesn't appear for players

1. **Check if module is enabled** - Verify in world settings that the module is active
2. **Check GM toggle** - Make sure the GM has actually toggled the lobby on
3. **Browser cache** - Have players perform a hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
4. **Check console** - Look for error messages in browser F12 console

### Players can still see the world

1. The overlay might be rendering behind other elements
2. Try toggling the lobby off and back on
3. Have the player refresh their browser
4. Check that JavaScript is enabled in browser settings

### Toggle button not appearing

1. Only appears for Game Masters
2. Verify you're logged in as a GM user
3. Try refreshing the page
4. Check browser console for JavaScript errors

## FAQ

**Q: Does this work with all systems?**
A: Yes! This module is completely system-agnostic. It works with D&D 5e, Pathfinder, Vampire: The Masquerade, and any other Foundry system.

**Q: What if a player disconnects and reconnects?**
A: The lobby state is persistent. When they reconnect, if the lobby is still active, they'll see the overlay immediately.

**Q: Can players bypass this?**
A: No. The module disables all interactive UI elements and overlays the entire viewport. Players cannot interact with the world while the lobby is active.

**Q: Does the GM see the overlay?**
A: No. The GM can always see and interact with the world normally, even with the lobby active.

**Q: Can I customize the message?**
A: Yes! Edit the localization strings in `lang/en.json` for your custom message.

**Q: What happens if the server crashes while lobby is active?**
A: The lobby state is saved as a world setting, so when the server restarts, the lobby will still be active.

## Support

Found a bug or have a feature request? Create an issue on the [GitHub Repository](https://github.com/Odinn-1982/ragnaroks-lobby).

## License

This module is provided as-is for use in Foundry VTT. See LICENSE file for details.

## Credits

Created by **RagNarok** for the Foundry VTT community.

---

**Remember**: The lobby is designed to prevent unwanted player access during maintenance. Always communicate with your players about scheduled maintenance windows when possible!
