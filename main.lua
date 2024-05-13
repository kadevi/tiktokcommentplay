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

connect()

local function getCommands()
  local data, err, partial = tcp:receive()
  if err == 'closed' then
    connect()
    return {}
  end
  local words = {}
  for word in partial:gmatch("%w+") do table.insert(words, word) end
  return words
end

local function update()
  local commands = getCommands()
  if #commands == 0 then return end
  if commands[1] == '0' then
    emu:clearKey(tonumber(commands[2]))
  elseif commands[1] == '1' then
    emu:addKey(tonumber(commands[2]))
  end
end

callbacks:add("frame", update)
