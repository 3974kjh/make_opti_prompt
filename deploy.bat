@echo off
REM LLM 프롬프트 최적화 도구 - Cloudflare Pages 배포 스크립트 (Windows)

echo 🚀 LLM 프롬프트 최적화 도구 배포 시작...

REM 의존성 설치
echo 📦 의존성 설치 중...
call npm install
if %errorlevel% neq 0 (
    echo ❌ 의존성 설치 실패!
    pause
    exit /b 1
)

REM 린트 및 타입 체크
echo 🔍 코드 품질 검사 중...
call npm run lint
if %errorlevel% neq 0 (
    echo ⚠️ 린트 검사에서 오류가 발견되었습니다.
)

call npm run check
if %errorlevel% neq 0 (
    echo ⚠️ 타입 체크에서 오류가 발견되었습니다.
)

REM 빌드
echo 🏗️ 프로젝트 빌드 중...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ 빌드 실패!
    pause
    exit /b 1
)

echo ✅ 빌드 완료!

REM Wrangler 확인 및 배포
where wrangler >nul 2>nul
if %errorlevel% equ 0 (
    echo 🌐 Cloudflare Pages에 배포 중...
    call wrangler pages deploy build --project-name=llm-prompt-optimizer
    if %errorlevel% equ 0 (
        echo 🎉 배포 완료!
        echo 📱 배포된 사이트: https://llm-prompt-optimizer.pages.dev
    ) else (
        echo ❌ 배포 실패!
        pause
        exit /b 1
    )
) else (
    echo ⚠️ Wrangler CLI가 설치되지 않았습니다.
    echo 다음 명령어로 설치하세요: npm install -g wrangler
    echo 또는 GitHub 연동을 통해 배포하세요.
)

pause 