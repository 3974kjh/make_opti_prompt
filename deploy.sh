#!/bin/bash

# LLM 프롬프트 최적화 도구 - Cloudflare Pages 배포 스크립트

echo "🚀 LLM 프롬프트 최적화 도구 배포 시작..."

# 의존성 설치
echo "📦 의존성 설치 중..."
npm install

# 린트 및 타입 체크
echo "🔍 코드 품질 검사 중..."
npm run lint
npm run check

# 빌드
echo "🏗️ 프로젝트 빌드 중..."
npm run build

# 빌드 성공 확인
if [ $? -eq 0 ]; then
    echo "✅ 빌드 완료!"
    
    # Wrangler가 설치되어 있는지 확인
    if command -v wrangler &> /dev/null; then
        echo "🌐 Cloudflare Pages에 배포 중..."
        wrangler pages deploy .svelte-kit/output/client --project-name=llm-prompt-optimizer
        
        if [ $? -eq 0 ]; then
            echo "🎉 배포 완료!"
            echo "📱 배포된 사이트: https://llm-prompt-optimizer.pages.dev"
        else
            echo "❌ 배포 실패!"
            exit 1
        fi
    else
        echo "⚠️ Wrangler CLI가 설치되지 않았습니다."
        echo "다음 명령어로 설치하세요: npm install -g wrangler"
        echo "또는 GitHub 연동을 사용하세요."
        echo ""
        echo "📖 자세한 내용은 README.md를 참조하세요."
    fi
else
    echo "❌ 빌드 실패!"
    exit 1
fi

echo ""
echo "🎉 스크립트 완료!" 