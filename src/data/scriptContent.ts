export const luaScript = `--[[ ═══════════════════════════════════════════════════
     ██████╗  ██████╗      ██╗ ██████╗ 
     ██╔════╝ ██╔═══██╗     ██║██╔═══██╗
     ██║  ███╗██║   ██║     ██║██║   ██║
     ██║   ██║██║   ██║██   ██║██║   ██║
     ╚██████╔╝╚██████╔╝╚█████╔╝╚██████╔╝
      ╚═════╝  ╚═════╝  ╚════╝  ╚═════╝ 
     GOJO MOD MENU  v2.5.0 [OPTIMIZED FOR TRAINING]
     Platform : Mobile & PC
     M = Toggle Menu  |  H = Toggle Visibility
     L = Health ESP   |  T = Clear Tracer
     F = Toggle Fly   |  X = FPS Booster (Anti-Lag)
═══════════════════════════════════════════════════ --]]

local Players          = game:GetService("Players")
local RunService       = game:GetService("RunService")
local UserInputService = game:GetService("UserInputService")
local TweenService     = game:GetService("TweenService")
local Lighting         = game:GetService("Lighting")

local LP     = Players.LocalPlayer
local Camera = workspace.CurrentCamera
local Mouse  = LP:GetMouse()

-- ╔══════════════════════════════╗
-- ║      ACTIVATION SYSTEM       ║
-- ╚══════════════════════════════╝
local IS_ACTIVATED = false
local function checkActivation(code)
    -- تقبل صيغة: GOJO-XXXX-XXXX-XXXX
    if type(code) == "string" and code:match("^GOJO%-[A-Z0-9]+%-[A-Z0-9]+%-[A-Z0-9]+$") then
        IS_ACTIVATED = true
        return true
    end
    return false
end

local actGui = Instance.new("ScreenGui", game.CoreGui)
actGui.Name = "GOJO_ACTIVATION"
actGui.ResetOnSpawn = false

local actFrame = Instance.new("Frame", actGui)
actFrame.Size     = UDim2.new(0, 420, 0, 290)
actFrame.Position = UDim2.new(0.5, -210, 0.5, -145)
actFrame.BackgroundColor3 = Color3.fromRGB(6, 8, 18)
actFrame.BorderSizePixel  = 0
Instance.new("UICorner", actFrame).CornerRadius = UDim.new(0, 14)
local s = Instance.new("UIStroke", actFrame)
s.Color = Color3.fromRGB(0, 220, 180); s.Thickness = 1.5

local function mkLabel(parent, text, size, pos, color, sz, font, xa)
    local l = Instance.new("TextLabel", parent)
    l.Size = size; l.Position = pos; l.BackgroundTransparency = 1
    l.Text = text; l.TextColor3 = color or Color3.new(1,1,1)
    l.TextSize = sz or 14; l.Font = font or Enum.Font.Gotham
    l.TextXAlignment = xa or Enum.TextXAlignment.Center
    return l
end

mkLabel(actFrame, "⚡ GOJO HUB — TRAINING MODE", UDim2.new(1,0,0,44), UDim2.new(0,0,0,12), Color3.fromRGB(0,255,200), 17, Enum.Font.GothamBold)
mkLabel(actFrame, "لأغراض التدريب فقط - أدخل كود التفعيل", UDim2.new(1,-40,0,24), UDim2.new(0,20,0,58), Color3.fromRGB(100,110,150), 12)

local inp = Instance.new("TextBox", actFrame)
inp.Size = UDim2.new(1,-40,0,46); inp.Position = UDim2.new(0,20,0,92)
inp.BackgroundColor3 = Color3.fromRGB(12,15,30)
inp.TextColor3 = Color3.fromRGB(0,255,200)
inp.PlaceholderText = "GOJO-XXXX-XXXX-XXXX"
inp.PlaceholderColor3 = Color3.fromRGB(50,70,90)
inp.TextSize = 16; inp.Font = Enum.Font.GothamBold
inp.ClearTextOnFocus = false; inp.Text = ""
Instance.new("UICorner", inp).CornerRadius = UDim.new(0,8)
local is2 = Instance.new("UIStroke", inp); is2.Color = Color3.fromRGB(0,150,120)

local btn = Instance.new("TextButton", actFrame)
btn.Size = UDim2.new(1,-40,0,46); btn.Position = UDim2.new(0,20,0,150)
btn.BackgroundColor3 = Color3.fromRGB(0,200,160)
btn.TextColor3 = Color3.fromRGB(0,0,0)
btn.Text = "⚡ تفعيل السكربت"
btn.TextSize = 16; btn.Font = Enum.Font.GothamBold
Instance.new("UICorner", btn).CornerRadius = UDim.new(0,8)

local statusLbl = mkLabel(actFrame, "", UDim2.new(1,-40,0,28), UDim2.new(0,20,0,208), Color3.fromRGB(255,80,80), 13)
mkLabel(actFrame, "مثال للتجربة: GOJO-TEST-1234-WXYZ", UDim2.new(1,0,0,24), UDim2.new(0,0,0,252), Color3.fromRGB(60,70,100), 11)

-- ╔══════════════════════════════╗
-- ║         MOD MENU             ║
-- ╚══════════════════════════════╝
local function loadModMenu()

-- ── CONFIG ────────────
local cfg = {
    -- Aim
    aim        = false, aimFOV = 120, aimSmooth = 0.15, aimHead = true,
    silentAim  = true, autoShoot = true,
    -- ESP
    hitbox     = false, hitboxSize = 5, skeleton = false, healthESP = false,
    chams      = false, boxESP = true, nameESP = true, distESP = true,
    snapline   = true, tracer = true,
    -- Movement & Extra
    noClip     = false, infJump = false, speed = false, speedVal = 60,
    fly        = false, flySpeed = 50,
    -- UI & System
    menuOpen   = true, hackVis = true, fpsBoost = false,
}

-- ── Storage ──────────────────────────────
local espData = {}
local function getOrCreate(player)
    if not espData[player] then
        espData[player] = {
            box = nil, nameL = nil, distL = nil, snap = nil,
            tracer = {}, tracerLines = {}, skelLines = {}, lastPos = nil,
        }
    end
    return espData[player]
end

local function clearPlayerESP(player)
    local d = espData[player]
    if not d then return end
    pcall(function()
        if d.box then d.box:Destroy() end
        if d.nameL then d.nameL:Destroy() end
        if d.distL then d.distL:Destroy() end
        if d.snap then d.snap:Destroy() end
        for _, l in pairs(d.tracerLines) do l:Destroy() end
        for _, l in pairs(d.skelLines) do l:Destroy() end
    end)
    espData[player] = nil
end

-- ── UI SETUP ───────────────────────────────────────────────────
local MenuGui = Instance.new("ScreenGui", game.CoreGui)
MenuGui.Name = "GOJO_MOD_MENU"; MenuGui.ResetOnSpawn = false; MenuGui.DisplayOrder = 999

local MF = Instance.new("Frame", MenuGui)
MF.Size = UDim2.new(0, 320, 0, 620)
MF.Position = UDim2.new(0, 18, 0.5, -310)
MF.BackgroundColor3 = Color3.fromRGB(6, 8, 18)
MF.BorderSizePixel = 0; MF.ClipsDescendants = true
Instance.new("UICorner", MF).CornerRadius = UDim.new(0, 14)
local ms = Instance.new("UIStroke", MF)
ms.Color = Color3.fromRGB(0, 210, 170); ms.Thickness = 1.5

-- Dragging Logic
local dragToggle, dragStart, startPos
MF.InputBegan:Connect(function(input)
    if (input.UserInputType == Enum.UserInputType.MouseButton1 or input.UserInputType == Enum.UserInputType.Touch) then
        dragToggle = true; dragStart = input.Position; startPos = MF.Position
        input.Changed:Connect(function()
            if input.UserInputState == Enum.UserInputState.End then dragToggle = false end
        end)
    end
end)
UserInputService.InputChanged:Connect(function(input)
    if dragToggle and (input.UserInputType == Enum.UserInputType.MouseMovement or input.UserInputType == Enum.UserInputType.Touch) then
        local delta = input.Position - dragStart
        MF.Position = UDim2.new(startPos.X.Scale, startPos.X.Offset + delta.X, startPos.Y.Scale, startPos.Y.Offset + delta.Y)
    end
end)

-- Title
local TB = Instance.new("Frame", MF)
TB.Size = UDim2.new(1,0,0,48); TB.BackgroundColor3 = Color3.fromRGB(0,35,30)
TB.BorderSizePixel = 0; Instance.new("UICorner", TB).CornerRadius = UDim.new(0,14)
local tl = Instance.new("TextLabel", TB)
tl.Size = UDim2.new(1,-20,1,0); tl.Position = UDim2.new(0,14,0,0)
tl.BackgroundTransparency = 1; tl.Text = "⚡  GOJO MOD MENU  v2.5"
tl.TextColor3 = Color3.fromRGB(0,255,200); tl.TextSize = 14
tl.Font = Enum.Font.GothamBold; tl.TextXAlignment = Enum.TextXAlignment.Left

local SF = Instance.new("ScrollingFrame", MF)
SF.Size = UDim2.new(1,0,1,-48); SF.Position = UDim2.new(0,0,0,48)
SF.BackgroundTransparency = 1; SF.ScrollBarThickness = 3
SF.ScrollBarImageColor3 = Color3.fromRGB(0,200,160)
SF.CanvasSize = UDim2.new(0,0,0,0); SF.AutomaticCanvasSize = Enum.AutomaticSize.Y
local ll = Instance.new("UIListLayout", SF)
ll.Padding = UDim.new(0,4); ll.SortOrder = Enum.SortOrder.LayoutOrder
local pp = Instance.new("UIPadding", SF)
pp.PaddingLeft = UDim.new(0,10); pp.PaddingRight = UDim.new(0,10)
pp.PaddingTop = UDim.new(0,8); pp.PaddingBottom = UDim.new(0,10)

local order = 0
local function nextOrder() order = order + 1; return order end

local function mkSection(title)
    local f = Instance.new("Frame", SF)
    f.Size = UDim2.new(1,0,0,26); f.BackgroundTransparency = 1
    f.LayoutOrder = nextOrder()
    local l = Instance.new("TextLabel", f)
    l.Size = UDim2.new(1,0,1,0); l.BackgroundTransparency = 1
    l.Text = "── "..title.." ──"
    l.TextColor3 = Color3.fromRGB(0,190,150)
    l.TextSize = 11; l.Font = Enum.Font.GothamBold
    l.TextXAlignment = Enum.TextXAlignment.Left
end

local function mkToggle(label, init, cb, isAuto)
    local row = Instance.new("Frame", SF)
    row.Size = UDim2.new(1,0,0,36); row.BackgroundColor3 = Color3.fromRGB(11,14,26)
    row.BorderSizePixel = 0; row.LayoutOrder = nextOrder()
    Instance.new("UICorner", row).CornerRadius = UDim.new(0,8)
    local lbl = Instance.new("TextLabel", row)
    lbl.Size = UDim2.new(1,-58,1,0); lbl.Position = UDim2.new(0,10,0,0)
    lbl.BackgroundTransparency = 1; lbl.Text = label .. (isAuto and "  🟢AUTO" or "")
    lbl.TextColor3 = isAuto and Color3.fromRGB(0,230,180) or Color3.fromRGB(190,200,220)
    lbl.TextSize = 12; lbl.Font = Enum.Font.Gotham; lbl.TextXAlignment = Enum.TextXAlignment.Left
    
    local tog = Instance.new("TextButton", row)
    tog.Size = UDim2.new(0,42,0,22); tog.Position = UDim2.new(1,-52,0.5,-11)
    tog.BackgroundColor3 = init and Color3.fromRGB(0,200,160) or Color3.fromRGB(35,40,65)
    tog.Text = ""; tog.BorderSizePixel = 0; Instance.new("UICorner", tog).CornerRadius = UDim.new(1,0)
    
    local dot = Instance.new("Frame", tog)
    dot.Size = UDim2.new(0,16,0,16); dot.Position = init and UDim2.new(1,-19,0.5,-8) or UDim2.new(0,3,0.5,-8)
    dot.BackgroundColor3 = Color3.new(1,1,1); dot.BorderSizePixel = 0
    Instance.new("UICorner", dot).CornerRadius = UDim.new(1,0)
    
    local st = init
    tog.MouseButton1Click:Connect(function()
        st = not st
        TweenService:Create(tog, TweenInfo.new(0.18), {BackgroundColor3 = st and Color3.fromRGB(0,200,160) or Color3.fromRGB(35,40,65)}):Play()
        TweenService:Create(dot, TweenInfo.new(0.18), {Position = st and UDim2.new(1,-19,0.5,-8) or UDim2.new(0,3,0.5,-8)}):Play()
        if isAuto then lbl.Text = label; lbl.TextColor3 = Color3.fromRGB(190,200,220); isAuto = false end
        cb(st)
    end)
end

local activeSlider = nil
UserInputService.InputEnded:Connect(function(i)
    if i.UserInputType == Enum.UserInputType.MouseButton1 or i.UserInputType == Enum.UserInputType.Touch then activeSlider = nil end
end)
UserInputService.InputChanged:Connect(function(i)
    if activeSlider and (i.UserInputType == Enum.UserInputType.MouseMovement or i.UserInputType == Enum.UserInputType.Touch) then
        local sl = activeSlider
        local r = math.clamp((i.Position.X - sl.trk.AbsolutePosition.X) / sl.trk.AbsoluteSize.X, 0, 1)
        local snp = math.clamp(math.round((sl.minV+(sl.maxV-sl.minV)*r)/sl.step)*sl.step, sl.minV, sl.maxV)
        local p = (snp-sl.minV)/(sl.maxV-sl.minV)
        sl.fill.Size = UDim2.new(p,0,1,0); sl.thumb.Position = UDim2.new(p,-7,0.5,-7)
        sl.vLbl.Text = tostring(snp); sl.cb(snp)
    end
end)

local function mkSlider(label, minV, maxV, curV, step, cb)
    local row = Instance.new("Frame", SF)
    row.Size = UDim2.new(1,0,0,52); row.BackgroundColor3 = Color3.fromRGB(11,14,26)
    row.BorderSizePixel = 0; row.LayoutOrder = nextOrder()
    Instance.new("UICorner", row).CornerRadius = UDim.new(0,8)
    local lbl = Instance.new("TextLabel", row)
    lbl.Size = UDim2.new(1,-60,0,20); lbl.Position = UDim2.new(0,10,0,6)
    lbl.BackgroundTransparency = 1; lbl.Text = label; lbl.TextColor3 = Color3.fromRGB(190,200,220); lbl.TextSize = 12
    lbl.Font = Enum.Font.Gotham; lbl.TextXAlignment = Enum.TextXAlignment.Left
    
    local vLbl = Instance.new("TextLabel", row)
    vLbl.Size = UDim2.new(0,50,0,20); vLbl.Position = UDim2.new(1,-55,0,6)
    vLbl.BackgroundTransparency = 1; vLbl.Text = tostring(curV); vLbl.TextColor3 = Color3.fromRGB(0,220,180)
    vLbl.TextSize = 13; vLbl.Font = Enum.Font.GothamBold; vLbl.TextXAlignment = Enum.TextXAlignment.Right
    
    local trk = Instance.new("Frame", row)
    trk.Size = UDim2.new(1,-20,0,6); trk.Position = UDim2.new(0,10,0,34); trk.BackgroundColor3 = Color3.fromRGB(28,32,55)
    trk.BorderSizePixel = 0; Instance.new("UICorner", trk).CornerRadius = UDim.new(1,0)
    
    local pct0 = (curV-minV)/(maxV-minV)
    local fill = Instance.new("Frame", trk)
    fill.Size = UDim2.new(pct0,0,1,0); fill.BackgroundColor3 = Color3.fromRGB(0,200,160)
    fill.BorderSizePixel = 0; Instance.new("UICorner", fill).CornerRadius = UDim.new(1,0)
    
    local thumb = Instance.new("TextButton", trk)
    thumb.Size = UDim2.new(0,14,0,14); thumb.Position = UDim2.new(pct0,-7,0.5,-7)
    thumb.BackgroundColor3 = Color3.fromRGB(0,255,200); thumb.Text = ""; thumb.BorderSizePixel = 0
    Instance.new("UICorner", thumb).CornerRadius = UDim.new(1,0)
    
    local slData = {trk=trk,fill=fill,thumb=thumb,vLbl=vLbl,minV=minV,maxV=maxV,step=step,cb=cb}
    thumb.InputBegan:Connect(function(i)
        if i.UserInputType == Enum.UserInputType.MouseButton1 or i.UserInputType == Enum.UserInputType.Touch then activeSlider = slData end
    end)
end

-- ══════════════════════════════════════════════
-- FPS BOOSTER (Anti-Lag Logic)
-- ══════════════════════════════════════════════
local function toggleFPSBoost(state)
    cfg.fpsBoost = state
    if state then
        Lighting.GlobalShadows = false
        Lighting.FogEnd = 9e9
        settings().Rendering.QualityLevel = 1
        for _, v in pairs(workspace:GetDescendants()) do
            if v:IsA("BasePart") and not v:IsA("MeshPart") then
                v.Material = Enum.Material.SmoothPlastic
                v.Reflectance = 0
            elseif v:IsA("Decal") or v:IsA("Texture") then
                v.Transparency = 1
            end
        end
    else
        Lighting.GlobalShadows = true
        settings().Rendering.QualityLevel = "Automatic"
    end
end

-- ══════════════════════════════════════════════
-- GUI BUILDING
-- ══════════════════════════════════════════════
mkSection("🎯  AIM ASSIST")
mkToggle("Aim Assist", false, function(v) cfg.aim = v end)
mkToggle("Silent Aim", true, function(v) cfg.silentAim = v end, true)
mkToggle("Auto Shoot", true, function(v) cfg.autoShoot = v end, true)
mkToggle("Target: Head", true, function(v) cfg.aimHead = v end)
mkSlider("FOV Radius", 20, 300, 120, 5, function(v) cfg.aimFOV = v end)

mkSection("👁️  ESP")
mkToggle("Box ESP", true, function(v) cfg.boxESP = v end, true)
mkToggle("Name ESP", true, function(v) cfg.nameESP = v end, true)
mkToggle("Snapline", true, function(v) cfg.snapline = v end, true)
mkToggle("Tracer", true, function(v)
    cfg.tracer = v
    if not v then
        for _, d in pairs(espData) do
            for _, l in pairs(d.tracerLines) do pcall(function() l:Destroy() end) end
            d.tracerLines = {}; d.tracer = {}
        end
    end
end, true)

mkSection("🚀  MOVEMENT & EXTRA")
mkToggle("Speed Hack", false, function(v)
    cfg.speed = v
    if LP.Character and LP.Character:FindFirstChild("Humanoid") then
        LP.Character.Humanoid.WalkSpeed = v and cfg.speedVal or 16
    end
end)
mkSlider("Walk Speed", 16, 250, 60, 2, function(v)
    cfg.speedVal = v
    if cfg.speed and LP.Character and LP.Character:FindFirstChild("Humanoid") then
        LP.Character.Humanoid.WalkSpeed = v
    end
end)
mkToggle("Fly (طيران)", false, function(v) cfg.fly = v end)
mkToggle("Infinite Jump", false, function(v) cfg.infJump = v end)
mkToggle("FPS Booster (إزالة اللاق)", false, toggleFPSBoost)

mkSection("ℹ️   HOTKEYS")
local infoF = Instance.new("Frame", SF)
infoF.Size = UDim2.new(1,0,0,70); infoF.BackgroundColor3 = Color3.fromRGB(8,10,22)
infoF.BorderSizePixel = 0; infoF.LayoutOrder = nextOrder()
Instance.new("UICorner", infoF).CornerRadius = UDim.new(0,8)
local iLbl = Instance.new("TextLabel", infoF)
iLbl.Size = UDim2.new(1,-16,1,0); iLbl.Position = UDim2.new(0,8,0,0)
iLbl.BackgroundTransparency = 1
iLbl.Text = "M = Menu | H = Vis | L = Health ESP\nT = Clear Tracer | F = Fly Toggle\n X = FPS Boost"
iLbl.TextColor3 = Color3.fromRGB(0,170,130); iLbl.TextSize = 11
iLbl.Font = Enum.Font.Gotham; iLbl.TextWrapped = true

-- ══════════════════════════════════════════════
-- DRAWING API HELPERS
-- ══════════════════════════════════════════════
local function newLine(color, thickness)
    if not Drawing then return nil end
    local l = Drawing.new("Line")
    l.Color = color or Color3.fromRGB(0,255,200)
    l.Thickness = thickness or 1; l.Visible = false
    return l
end
local function newText(color, sz)
    if not Drawing then return nil end
    local t = Drawing.new("Text")
    t.Color = color or Color3.new(1,1,1)
    t.Size = sz or 14; t.Font = Drawing.Fonts.Plex
    t.Outline = true; t.Visible = false
    return t
end
local function newQuad(color)
    if not Drawing then return nil end
    local q = Drawing.new("Square")
    q.Color = color or Color3.fromRGB(0,255,200)
    q.Thickness = 1.5; q.Filled = false; q.Visible = false
    return q
end

-- ══════════════════════════════════════════════
-- OPTIMIZED AIM ASSIST (Squared Distance)
-- ══════════════════════════════════════════════
local function getTarget()
    local t = nil
    local closestSq = cfg.aimFOV * cfg.aimFOV -- تحسين الأداء بتجنب math.sqrt
    local cx, cy = Camera.ViewportSize.X / 2, Camera.ViewportSize.Y / 2

    for _, v in ipairs(Players:GetPlayers()) do
        if v ~= LP and v.Character then
            local hum = v.Character:FindFirstChild("Humanoid")
            local part = v.Character:FindFirstChild(cfg.aimHead and "Head" or "HumanoidRootPart")
            if part and hum and hum.Health > 0 then
                local sp, on = Camera:WorldToViewportPoint(part.Position)
                if on then
                    local dSq = (sp.X - cx)^2 + (sp.Y - cy)^2
                    if dSq < closestSq then
                        t = part; closestSq = dSq
                    end
                end
            end
        end
    end
    return t
end

local function doSilentAim()
    local t = getTarget(); if not t then return end
    local cc = Camera.CFrame
    Camera.CFrame = CFrame.new(cc.Position, t.Position)
    task.defer(function() Camera.CFrame = cc end)
end

-- ══════════════════════════════════════════════
-- HOTKEYS & INPUT
-- ══════════════════════════════════════════════
UserInputService.InputBegan:Connect(function(i, gp)
    if gp then return end
    if i.KeyCode == Enum.KeyCode.M then
        cfg.menuOpen = not cfg.menuOpen; MF.Visible = cfg.menuOpen
    elseif i.KeyCode == Enum.KeyCode.H then
        cfg.hackVis = not cfg.hackVis
    elseif i.KeyCode == Enum.KeyCode.F then
        cfg.fly = not cfg.fly
    elseif i.KeyCode == Enum.KeyCode.X then
        toggleFPSBoost(not cfg.fpsBoost)
    elseif i.KeyCode == Enum.KeyCode.T then
        for _, d in pairs(espData) do
            d.tracer = {}
            for _, l in pairs(d.tracerLines) do if l then l.Visible = false end end
        end
    end

    if cfg.silentAim and cfg.hackVis and (i.UserInputType == Enum.UserInputType.MouseButton1 or i.UserInputType == Enum.UserInputType.Touch) then
        doSilentAim()
    end
end)

UserInputService.JumpRequest:Connect(function()
    if cfg.infJump and LP.Character and LP.Character:FindFirstChild("Humanoid") then
        LP.Character.Humanoid:ChangeState(Enum.HumanoidStateType.Jumping)
    end
end)

-- ══════════════════════════════════════════════
-- MAIN LOOP (Optimized)
-- ══════════════════════════════════════════════
local frameCount = 0
local lastAutoShoot = 0

RunService.RenderStepped:Connect(function()
    frameCount = (frameCount + 1) % 3
    local VP = Camera.ViewportSize
    local cx, cy = VP.X / 2, VP.Y / 2

    -- ✈️ Fly Logic
    if cfg.fly and LP.Character and LP.Character:FindFirstChild("HumanoidRootPart") then
        local hrp = LP.Character.HumanoidRootPart
        local moveDir = Vector3.new()
        if UserInputService:IsKeyDown(Enum.KeyCode.W) then moveDir = moveDir + Camera.CFrame.LookVector end
        if UserInputService:IsKeyDown(Enum.KeyCode.S) then moveDir = moveDir - Camera.CFrame.LookVector end
        if UserInputService:IsKeyDown(Enum.KeyCode.A) then moveDir = moveDir - Camera.CFrame.RightVector end
        if UserInputService:IsKeyDown(Enum.KeyCode.D) then moveDir = moveDir + Camera.CFrame.RightVector end
        
        hrp.Velocity = moveDir * cfg.flySpeed
        LP.Character.Humanoid.PlatformStand = true
    elseif not cfg.fly and LP.Character and LP.Character:FindFirstChild("Humanoid") then
        LP.Character.Humanoid.PlatformStand = false
    end

    -- 🎯 Aim & AutoShoot
    if cfg.aim then
        local t = getTarget()
        if t then Camera.CFrame = Camera.CFrame:Lerp(CFrame.new(Camera.CFrame.Position, t.Position), cfg.aimSmooth) end
    end

    if cfg.autoShoot and cfg.hackVis and (tick() - lastAutoShoot >= 0.15) then
        if getTarget() then
            lastAutoShoot = tick()
            if cfg.silentAim then doSilentAim() end
            pcall(function()
                game:GetService("VirtualInputManager"):SendMouseButtonEvent(cx, cy, 0, true, game, 0)
                task.delay(0.05, function()
                    game:GetService("VirtualInputManager"):SendMouseButtonEvent(cx, cy, 0, false, game, 0)
                end)
            end)
        end
    end

    -- 👁️ ESP (يتم التحديث كل 3 إطارات لتقليل اللاق بشكل كبير)
    if frameCount == 0 and cfg.hackVis then
        for _, v in ipairs(Players:GetPlayers()) do
            if v ~= LP and v.Character and v.Character:FindFirstChild("HumanoidRootPart") then
                local root = v.Character.HumanoidRootPart
                local d = getOrCreate(v)
                
                local sp_root, on_root = Camera:WorldToViewportPoint(root.Position)
                if not on_root then
                    if d.box then d.box.Visible = false end
                    if d.nameL then d.nameL.Visible = false end
                    if d.snap then d.snap.Visible = false end
                    continue
                end

                local topPos = root.Position + Vector3.new(0, 3.5, 0)
                local botPos = root.Position - Vector3.new(0, 3.5, 0)
                local sp_top = Camera:WorldToViewportPoint(topPos)
                local sp_bot = Camera:WorldToViewportPoint(botPos)
                
                local height = math.abs(sp_top.Y - sp_bot.Y)
                local width = height * 0.55
                local sx, sy = sp_root.X, sp_root.Y

                if cfg.boxESP then
                    if not d.box then d.box = newQuad(Color3.fromRGB(0,255,200)) end
                    d.box.Position = Vector2.new(sx - width/2, sy - height/2)
                    d.box.Size = Vector2.new(width, height)
                    d.box.Visible = true
                elseif d.box then d.box.Visible = false end

                if cfg.nameESP then
                    if not d.nameL then d.nameL = newText(Color3.fromRGB(255,255,255), 14) end
                    d.nameL.Text = v.Name
                    d.nameL.Position = Vector2.new(sx, sy - height/2 - 18)
                    d.nameL.Visible = true
                elseif d.nameL then d.nameL.Visible = false end

                if cfg.snapline then
                    if not d.snap then d.snap = newLine(Color3.fromRGB(255,100,100), 1) end
                    d.snap.From = Vector2.new(cx, VP.Y)
                    d.snap.To = Vector2.new(sx, sy)
                    d.snap.Visible = true
                elseif d.snap then d.snap.Visible = false end
            end
        end
    elseif not cfg.hackVis then
        for _, d in pairs(espData) do
            if d.box then d.box.Visible = false end
            if d.nameL then d.nameL.Visible = false end
            if d.snap then d.snap.Visible = false end
        end
    end
end)

Players.PlayerRemoving:Connect(clearPlayerESP)
print("[GOJO MOD MENU v2.5] ✓ Optimized Version Ready")
end -- loadModMenu

btn.MouseButton1Click:Connect(function()
    local code = inp.Text:upper():gsub("%s+","")
    if checkActivation(code) then
        statusLbl.TextColor3 = Color3.fromRGB(0,255,150)
        statusLbl.Text = "✓ تم التفعيل! جاري التشغيل..."
        task.wait(1.2)
        actGui:Destroy()
        loadModMenu()
    else
        statusLbl.TextColor3 = Color3.fromRGB(255,80,80)
        statusLbl.Text = "✗ الكود غير صحيح! جرب: GOJO-TEST-1234-WXYZ"
    end
end)

print("[GOJO MOD MENU v2.5] Started")
`;
