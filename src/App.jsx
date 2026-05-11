import { useState, Suspense, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stage } from '@react-three/drei'
import { Model as Room } from './Room'

function App() {
  const [selectedFurniture, setSelectedFurniture] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [sortBy, setSortBy] = useState('year');

  // 데이터 리스트 (33개 항목 전체 포함)
  const tvMediaList = [
    { name: "의리적 구토", date: "1919. 10", genre: "영화", status: "완전 소실", details: "[상태] 완전 소실\n[상세] 한국 최초의 연쇄극. 필름 유실." },
    { name: "아리랑", date: "1926. 10", genre: "영화", status: "필름 유실", details: "[상태] 필름 원본 유실\n[상세] 나운규 감독의 걸작. 스틸컷으로만 전해짐." },
    { name: "심청전", date: "1937", genre: "영화", status: "필름 유실", details: "[상태] 필름 유실\n[상세] 초기 유성 영화 선구작. 복원 불가능." },
    { name: "자유만세", date: "1946", genre: "영화", status: "일부 유실", details: "[상태] 마스터 필름 일부 유실\n[상세] 해방 후 첫 영화. 보관 과정에서 손상됨." },
    { name: "피아골", date: "1955", genre: "영화", status: "일부 유실", details: "[상태] 필름 및 사운드 손상\n[상세] 현재는 복원본만 존재." },
    { name: "하녀", date: "1960", genre: "영화", status: "복원본 존재", details: "[상태] 원본 유실 후 복원\n[상세] 김기영 감독 작품. 해외 발견 프린트로 복원." },
    { name: "오발탄", date: "1961", genre: "영화", status: "원본 유실", details: "[상태] 원본 네거티브 유실\n[상세] 복사본 필름으로만 전해짐." },
    { name: "만추", date: "1966. 12.", genre: "영화", status: "필름 유실", details: "[상태] 필름 원본 유실\n[상세] 이만희 감독의 명작. 리메이크작들만 존재." },
    { name: "로보트 태권 V", date: "1976", genre: "애니메이션", status: "복원본 존재", details: "[상태] 원본 필름 유실 후 복원\n[상세] 2003년 복사본 발견으로 기적적 복원." },
    { name: "Heavyweight Champ", date: "1976", genre: "콘솔 게임", status: "초기 버전 유실", details: "[상태] 1976년작 기판 유실\n[상세] 아케이드 버전 기판 소실." },
    { name: "전설의 고향", date: "1977", genre: "TV 드라마", status: "일부 유실", details: "[상태] 방송사 아카이브 손실\n[상세] 초기 방영분 중 일부 에피소드 유실." },
    { name: "꽃의 요정 루루", date: "1980", genre: "애니메이션", status: "더빙판 일부 유실", details: "[상태] 한국어 더빙판 일부 유실\n[상세] 방영 당시 한국어 녹음 테이프가 사라짐." },
    { name: "꼬마자동차 붕붕", date: "1985. 4.", genre: "애니메이션", status: "일부 유실", details: "[상태] 에피소드 절반 가량 유실\n[상세] 한국어 더빙판 테이프 상당수 유실." },
    { name: "아이댄스 (iDance)", date: "1999", genre: "게임", status: "완전 소실", details: "[상태] 데이터 전체 유실\n[상세] 국산 리듬 게임 초기작 소실." },
    { name: "수수께끼 블루", date: "2000. 7", genre: "애니메이션", status: "일부 유실", details: "[상태] 에피소드 상당수 유실\n[상세] 수집가 확보분 외 대다수 소실." },
    { name: "꼬마 고양이 마오", date: "2002. 5", genre: "애니메이션", status: "비디오 완전 소실", details: "[상태] 비디오 완전 소실\n[상세] 개인 녹화본조차 발견되지 않음." },
    { name: "Bones: Skeleton Crew", date: "2005", genre: "TV 드라마", status: "일부 유실", details: "[상태] 화재로 인한 소실\n[상세] 스튜디오 화재로 마스터 테이프 대부분 유실." },
    { name: "라즈베리 타임즈", date: "2006. 11", genre: "애니메이션", status: "일부 유실", details: "[상태] 한국어 녹음본 일부 유실\n[상세] 특정 회차 더빙 데이터 유실." }
  ];

  const laptopMediaList = [
    { name: "세이클럽 아바타", date: "1999", genre: "커뮤니티", status: "완전 유실", details: "[상태] 서비스 종료 후 소실\n[상세] 세계 최초 아바타 유료화 모델 데이터 전량 유실." },
    { name: "프리첼", date: "1999", genre: "커뮤니티", status: "일부 유실", details: "[상태] 자료 대거 유실\n[상세] 유료화 전환기 이용자 이탈로 방대한 자료 유실." },
    { name: "다모임", date: "1999", genre: "커뮤니티", status: "완전 유실", details: "[상태] 서버 종료\n[상세] 초기 동창 찾기 사이트 데이터 완전 소실." },
    { name: "라이코스 코리아", date: "1999", genre: "포털 서비스", status: "완전 유실", details: "[상태] 서비스 종료\n[상세] 초기 국내 포털 데이터 상당 부분 유실." },
    { name: "퀴즈퀴즈 (초기)", date: "1999", genre: "온라인 게임", status: "데이터 유실", details: "[상태] 초기 리소스 유실\n[상세] 넥슨 초기 시스템 데이터 소실." },
    { name: "버디버디", date: "2000", genre: "메신저", status: "완전 유실", details: "[상태] 서버 종료\n[상세] 메신저 기록 및 데이터 복구 불가." },
    { name: "야후! 꾸러기", date: "2002", genre: "포털 서비스", status: "일부 유실", details: "[상태] 야후 코리아 철수\n[상세] 어린이용 콘텐츠 데이터 대부분 유실." },
    { name: "The $1,000,000 Pyramid", date: "2001", genre: "비디오 게임", status: "완전 소실", details: "[상태] 마스터 데이터 파손\n[상세] 출시 직전 데이터 파손으로 발매 취소." },
    { name: "넷마블 캐치마인드 (초기)", date: "2002", genre: "캐주얼 게임", status: "일부 유실", details: "[상태] 초기 버전 소실\n[상세] 초기 버전 아트워크 및 리소스 유실." },
    { name: "Crash Village", date: "2003", genre: "온라인 게임", status: "구동 불가", details: "[상태] 서버 중단\n[상세] 소스 코드 유실로 현재 플레이 불가." },
    { name: "컴투스 붕어빵타이쿤 1", date: "2001", genre: "모바일 게임", status: "구동 불가", details: "[상태] 소스 코드 유실\n[상세] 피처폰 시절 원본 코드 소실." },
    { name: "플라스틱스 온라인", date: "2003", genre: "RPG", status: "완전 유실", details: "[상태] 서버 폐기\n[상세] 모든 서버 데이터 삭제됨." },
    { name: "the club", date: "2004", genre: "커뮤니티", status: "데이터 유실", details: "[상태] 데이터 유실\n[상세] 초기 소셜 서비스 데이터 아카이빙 실패." },
    { name: "파란", date: "2004", genre: "포털 서비스", status: "완전 유실", details: "[상태] 서비스 종료\n[상세] 하이텔/한미르 통합 데이터 유실." },
    { name: "CNN Pipeline", date: "2005", genre: "웹 서비스", status: "유실됨", details: "[상태] 서비스 종료\n[상세] 초기 유료 뉴스 아카이브 유실." },
    { name: "엠파스", date: "2006", genre: "포털 서비스", status: "완전 유실", details: "[상태] 네이트 통합 후 소실\n[상세] 초기 지식 검색 데이터 대부분 유실." },
    { name: "아비스 대모험", date: "2006", genre: "턴제 RPG", status: "2010년 종료", details: "[상태] 클라이언트 유실\n[상세] 실행 파일 및 서버 데이터 완전 유실." }
  ];

  const archiveData = {
    TV: { title: "Lost\nfilms\n& games", icon: "./tv_icon.png", list: tvMediaList },
    Laptop: { title: "Lost\nWeb\n& etc...", icon: "./laptop_icon.png", list: laptopMediaList }
  };

  const currentData = archiveData[selectedFurniture];

  // 정렬 계산 로직
  const sortedList = useMemo(() => {
    if (!currentData) return [];
    let list = [...currentData.list];
    if (sortBy === 'year') {
      return list.sort((a, b) => {
        const yearA = parseInt(a.date.match(/\d{4}/)?.[0] || "9999");
        const yearB = parseInt(b.date.match(/\d{4}/)?.[0] || "9999");
        return yearA - yearB;
      });
    } else {
      return list.sort((a, b) => a.genre.localeCompare(b.genre));
    }
  }, [currentData, sortBy]);

  return (
    <div style={{ margin: 0, padding: 0, width: '100vw', height: '100vh', background: '#000', position: 'relative', overflow: 'hidden' }}>
      
      <Canvas shadows camera={{ position: [5, 5, 5], fov: 50 }} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
        <Suspense fallback={null}>
          <Stage intensity={0.5} environment="city" shadows={false}>
            <Room onSelectFurniture={(name) => {
              setSelectedFurniture(name);
              setExpandedIndex(null);
            }} />
          </Stage>
        </Suspense>
        <OrbitControls makeDefault />
      </Canvas>

      {selectedFurniture && currentData && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          zIndex: 1000, 
          overflowY: 'auto',
          fontFamily: 'OnulDaisy, sans-serif'
        }}>
          
          <button onClick={() => setSelectedFurniture(null)} 
            style={{ position: 'fixed', top: '30px', right: '40px', background: 'none', border: 'none', fontSize: '30px', cursor: 'pointer', zIndex: 1001, fontFamily: 'OnulDaisy' }}>
            ×
          </button>

          <div style={{ 
            width: '100%',
            paddingTop: '60px', 
            paddingLeft: '90px', 
            paddingRight: '90px',
            paddingBottom: '60px',
            boxSizing: 'border-box'
          }}>
            
            {/* 최상단 제목 (흰색 투명 박스 배경 추가) */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '120px' }}>
              <img src={currentData.icon} alt="icon" style={{ height: '180px', width: 'auto', marginRight: '40px' }} />
              <div style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.9)', // 투명도 90% 흰색
                padding: '10px 25px', // 텍스트 여백
                display: 'inline-block', // 텍스트 크기에 맞춤
                borderRadius: '0' // 모든 각 90도
              }}>
                <h1 style={{ 
                  fontSize: '60px', 
                  fontWeight: 'normal', 
                  lineHeight: '1.0', 
                  margin: 0, 
                  whiteSpace: 'pre-wrap', 
                  color: '#000', 
                  fontFamily: 'OnulDaisy' 
                }}>
                  {currentData.title}
                </h1>
              </div>
            </div>

            {/* 정렬 버튼 */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginBottom: '20px' }}>
              <button 
                onClick={() => setSortBy('year')}
                style={{
                  backgroundColor: sortBy === 'year' ? '#ffe200' : '#fff9c4',
                  border: 'none', padding: '6px 20px', fontFamily: 'OnulDaisy', fontSize: '16px', cursor: 'pointer', borderRadius: '0',
                  boxShadow: sortBy === 'year' ? '0 4px 0 #b39e00' : '0 4px 0 #d1c16d', color: '#000'
                }}>년도순</button>
              <button 
                onClick={() => setSortBy('genre')}
                style={{
                  backgroundColor: sortBy === 'genre' ? '#ffe200' : '#fff9c4',
                  border: 'none', padding: '6px 20px', fontFamily: 'OnulDaisy', fontSize: '16px', cursor: 'pointer', borderRadius: '0',
                  boxShadow: sortBy === 'genre' ? '0 4px 0 #b39e00' : '0 4px 0 #d1c16d', color: '#000'
                }}>장르별</button>
            </div>

            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {sortedList.map((item, index) => (
                <div key={item.name} style={{ display: 'flex', flexDirection: 'column' }}>
                  <div 
                    onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                    style={{
                      display: 'flex', backgroundColor: '#f9e6ff', padding: '8px 30px', fontSize: '18px', color: '#000', minHeight: '20px', alignItems: 'center', cursor: 'pointer', fontFamily: 'OnulDaisy'
                    }}
                  >
                    <span style={{ width: '30%', flexShrink: 0 }}>
                      <span style={{
                        backgroundColor: '#f2afff', // 짙은 분홍색 박스
                        padding: '4px 12px',
                        display: 'inline-block',
                        borderRadius: '0'
                      }}>
                        {item.name}
                      </span>
                    </span>
                    <span style={{ width: '20%', flexShrink: 0 }}>{item.date}</span>
                    <span style={{ width: '20%', flexShrink: 0 }}>{item.genre}</span>
                    <span style={{ width: '30%', flexShrink: 0 }}>{item.status}</span>
                  </div>

                  {expandedIndex === index && item.details && (
                    <div style={{
                      backgroundColor: '#fdf2ff', 
                      padding: '25px 40px', 
                      fontSize: '16px', 
                      color: '#444', 
                      borderTop: '1px solid #f2d1ff', 
                      fontFamily: 'OnulDaisy', 
                      lineHeight: '1.7', 
                      whiteSpace: 'pre-wrap',
                      textAlign: 'center'
                    }}>
                      {item.details}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App