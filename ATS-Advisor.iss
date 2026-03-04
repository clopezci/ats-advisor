; ATS Advisor - Installer Profesional

[Setup]
AppId={{C2B6E0E7-9A2C-4F7B-9A2F-2B5A1C0D7A21}}
AppName=ATS Advisor
SetupIconFile=assets\icon\ats_advisor.ico
AppVersion=1.8.0
AppPublisher=Carlos Emilio López
AppPublisherURL=https://github.com/
AppSupportURL=https://github.com/
AppUpdatesURL=https://github.com/

ArchitecturesInstallIn64BitMode=x64compatible
DefaultDirName={localappdata}\Programs\ATS Advisor
DefaultGroupName=ATS Advisor
DisableProgramGroupPage=yes
LicenseFile=LICENSE.TXT

OutputDir=installer
OutputBaseFilename=ATS-Advisor-Setup-v1.8.0

Compression=lzma2
SolidCompression=yes
WizardStyle=modern

PrivilegesRequired=lowest
UsePreviousAppDir=yes

[Languages]
Name: "spanish"; MessagesFile: "compiler:Languages\Spanish.isl"

[Tasks]
Name: "desktopicon"; Description: "Crear acceso directo en el escritorio"; GroupDescription: "Accesos directos:"; Flags: unchecked

[Files]
Source: "dist\ATS-Advisor\*"; DestDir: "{app}"; Flags: recursesubdirs createallsubdirs ignoreversion

[Icons]
Name: "{group}\ATS Advisor"; Filename: "{app}\ATS-Advisor.exe"
Name: "{autodesktop}\ATS Advisor"; Filename: "{app}\ATS-Advisor.exe"; Tasks: desktopicon


[Run]
Filename: "{app}\ATS-Advisor.exe"; Description: "Iniciar ATS Advisor"; Flags: nowait postinstall skipifsilent