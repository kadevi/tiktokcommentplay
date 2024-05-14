local socket = require('socket.core')

local tcp = socket.tcp()
tcp:settimeout(0)

local function connect()
  tcp:close()
  -- console:log("Connecting")
  local success, err = tcp:connect("localhost", 3000)
  -- if success then
  -- console:log('Connect success')
  -- else
  -- console:log('Connect failed ' .. err)
  -- end
end

local function getCommands()
  local data, err, partial = tcp:receive()
  if err == 'closed' then
    connect()
    return {}
  end
  print(partial)
  local words = {}
  for word in partial:gmatch("%w+") do table.insert(words, word) end
  return words
end

local function haduken()
  memory.writebyte(0x57, 0xaa)
end

local function shoryuken()
  memory.writebyte(0x9f, 0xf5)
end
connect()

while true do
  gui.text(50, 50, "Hello world!")
  local commands = getCommands()
  if #commands ~= 0 then
    print(commands[1])
    if commands[1] == 'haduken' then
      haduken()
    elseif commands[1] == 'shoryuken' then
      shoryuken()
    end
  end
  emu.frameadvance()
end
