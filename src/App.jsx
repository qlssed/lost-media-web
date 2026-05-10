import { useState, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stage } from '@react-three/drei'
import { Model as Room } from './Room'

function App() {
  const [selectedFurniture, setSelectedFurniture] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null);

  // 1. TV 전용 리스트
  const tvMediaList = [
    { name: "의리적 구토", date: "1919. 10", genre: "영화", status: "완전 소실", details: "[상태] 필름 완전 소실\n[상세] 한국 최초의 연쇄극이나 당시 상영되었던 필름이 현재까지 단 한 프레임도 발견되지 않음." },
    { name: "아리랑", date: "1926. 10", genre: "영화", status: "필름 유실", details: "[상태] 필름 원본 유실\n[상세] 나운규 감독의 걸작으로 필름이 소실되어 현재는 스틸컷과 줄거리로만 전해짐." },
    { name: "심청전", date: "1937", genre: "영화", status: "필름 유실", details: "[상태] 필름 유실\n[상세] 초기 유성 영화의 선구작으로 평가받으나 원본 필름의 행방이 묘연함." },
    { name: "만추", date: "1966. 12.", genre: "영화", status: "필름 유실", details: "[상태] 필름 원본 유실\n[상세] 이만희 감독의 걸작. 현재는 시나리오와 일부 스틸컷으로만 존재함." },
    { name: "Heavyweight Champ", date: "1976", genre: "콘솔 게임", status: "초기 버전 유실", details: "[상태] 초기 버전 유실\n[상세] 1976년 아케이드 버전 기판이 발견되지 않고 있음." },
    { name: "꼬마자동차 붕붕", date: "1985. 4.", genre: "애니메이션", status: "일부 유실", details: "[상태] 에피소드의 절반 가량 유실\n[상세] 한국어 더빙판 방영분 중 상당수 테이프가 손상되거나 소실됨." },
    { name: "아이댄스 (iDance)", date: "1999", genre: "게임", status: "완전 소실", details: "[상태] 일부 스크린샷과 3D 모델 제외 소실\n[상세] 국산 리듬 게임의 초기작이나 데이터가 완전히 유실됨." },
    { name: "수수께끼 블루", date: "2000. 7", genre: "애니메이션", status: "일부 유실", details: "[상태] 일부 에피소드 제외 소실\n[상세] 한국어판 방영분 중 상당수 에피소드는 유실됨." },
    { name: "꼬마 고양이 마오", date: "2002. 5", genre: "애니메이션", status: "비디오 완전 소실", details: "[상태] 비디오 완전 소실\n[상세] 방송사 아카이브 및 개인 녹화본이 전혀 발견되지 않은 상태." },
    { name: "The Dog and Cat News", date: "2000년대 중반", genre: "애니메이션", status: "일부 소실", details: "[상태] 전체 에피소드 중 일부 유실\n[상세] 디지털 아카이브에 포함되지 않아 시청이 불가능함." },
    { name: "라즈베리 타임즈", date: "2006. 11", genre: "애니메이션", status: "일부 유실", details: "[상태] 한국어 녹음본 일부 유실\n[상세] 특정 회차의 한국어 더빙 데이터가 유실됨." },
    { name: "Bones: Skeleton Crew", date: "", genre: "TV 드라마", status: "일부 유실", details: "[상태] 에피소드 3개 제외 소실\n[상세] 스튜디오 화재로 인해 촬영된 마스터 테이프가 대부분 소실됨." }
  ];

  // 2. 노트북 전용 리스트
  const laptopMediaList = [
    { name: "세이클럽 아바타", date: "1999", genre: "커뮤니티", status: "완전 유실", details: "[상태] 서비스 종료 및 데이터 폐기\n[상세] 서비스 종료 후 모든 데이터가 소실됨." },
    { name: "프리첼", date: "1999", genre: "커뮤니티", status: "일부 유실", details: "[상태] 유료화 이후 데이터 소실\n[상세] 방대한 커뮤니티 자료가 서비스 중단과 함께 유실됨." },
    { name: "버디버디", date: "2000", genre: "메신저", status: "완전 유실", details: "[상태] 서버 종료로 인한 데이터 폐쇄\n[상세] 서비스 종료 후 데이터 복구가 불가능함." },
    { name: "야후! 꾸러기", date: "2000년대 초반", genre: "포털 서비스", status: "일부 유실", details: "[상태] 서비스 종료\n[상세] 야후 코리아 철수와 함께 원본 데이터가 대부분 유실됨." },
    { name: "Crash Village", date: "2000년대 초반", genre: "온라인 게임", status: "구동 불가", details: "[상태] 원본 데이터 유실\n[상세] 플래시 지원 종료로 인해 현재는 구동할 수 없는 상태." },
    { name: "컴투스 붕어빵타이쿤 1", date: "2001", genre: "모바일 게임", status: "구동 불가", details: "[상태] 원본 파일 유실\n[상세] 피처폰 시절 인기 게임이나 원본 소스 코드가 없음." },
    { name: "넷마블 캐치마인드 (초기작)", date: "2002", genre: "캐주얼 게임", status: "일부 유실", details: "[상태] 초기 버전 데이터 유실\n[상세] 초기 버전의 아트워크 및 소스 코드가 소실됨." },
    { name: "플라스틱스 온라인", date: "2003. 3. 21.", genre: "RPG", status: "완전 유실", details: "[상태] 완전 유실\n[상세] 2005년 개발사 도산 이후 서버 데이터가 폐기됨." },
    { name: "the club", date: "2004", genre: "커뮤니티", status: "데이터 유실", details: "[상태] 서버 종료 후 데이터 소실\n[상세] 서비스 중단 이후 데이터가 유실됨." },
    { name: "CNN Pipeline", date: "2005", genre: "웹 서비스", status: "유실됨", details: "[상태] 서비스 종료\n[상세] 초기 온라인 뉴스 유료 서비스. 현재는 아카이브를 찾기 어려움." },
    { name: "아비스 대모험", date: "2006. 7.", genre: "턴제 RPG", status: "2010년 서비스 종료", details: "[상태] 2010년 서비스 종료\n[상세] 현재 구동 가능한 클라이언트가 유실됨." },
    { name: "The $1,000,000 Pyramid", date: "", genre: "비디오 게임", status: "완전 소실", details: "[상태] 마스터 데이터 파손\n[상세] 출시 직전 마스터 데이터 파손으로 발매가 취소됨." }
  ];

  const archiveData = {
    TV: { title: "Lost\nfilms\n& games", icon: "/tv_icon.png", list: tvMediaList },
    Laptop: { title: "Lost\nWeb\n& etc...", icon: "/laptop_icon.png", list: laptopMediaList }
  };

  const currentData = archiveData[selectedFurniture];

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000', position: 'relative', overflow: 'hidden' }}>
      <Canvas shadows camera={{ position: [5, 5, 5], fov: 50 }}>
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

          {/* 🛠️ 레이아웃 수정: paddingLeft와 paddingRight를 90px로 통일 */}
          <div style={{ 
            width: '100%',
            paddingTop: '60px', 
            paddingLeft: '90px', 
            paddingRight: '90px', // 우측 여백도 90px 추가
            paddingBottom: '60px',
            boxSizing: 'border-box'
          }}>
            
            {/* 상단 제목 섹션 */}
            <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '120px' }}>
              <img src={currentData.icon} alt="icon" style={{ height: '180px', width: 'auto', marginRight: '40px' }} />
              <h1 style={{ fontSize: '60px', fontWeight: 'normal', lineHeight: '1.0', margin: 0, whiteSpace: 'pre-wrap', color: '#000', fontFamily: 'OnulDaisy' }}>
                {currentData.title}
              </h1>
            </div>

            {/* 🛠️ 리스트 섹션: 텍스트 간격 최적화 */}
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {currentData.list.map((item, index) => (
                <div key={index} style={{ display: 'flex', flexDirection: 'column' }}>
                  <div 
                    onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                    style={{
                      display: 'flex',
                      backgroundColor: '#f9e6ff',
                      padding: '12px 30px', // 좌우 패딩을 조금 더 늘림
                      fontSize: '18px', // 텍스트 크기 미세하게 조정
                      color: '#000',
                      minHeight: '30px',
                      alignItems: 'center',
                      cursor: 'pointer',
                      fontFamily: 'OnulDaisy'
                    }}
                  >
                    {/* 텍스트 가로 비중 조절 (합계 100%) */}
                    <span style={{ width: '25%', fontFamily: 'OnulDaisy' }}>{item.name}</span>
                    <span style={{ width: '15%', fontFamily: 'OnulDaisy' }}>{item.date}</span>
                    <span style={{ width: '15%', fontFamily: 'OnulDaisy' }}>{item.genre}</span>
                    <span style={{ width: '45%', fontFamily: 'OnulDaisy' }}>{item.status}</span>
                  </div>

                  {expandedIndex === index && item.details && (
                    <div style={{
                      backgroundColor: '#fdf2ff',
                      padding: '25px 40px', // 확장 칸 여백도 시원하게 조정
                      fontSize: '16px',
                      color: '#444',
                      borderTop: '1px solid #f2d1ff',
                      fontFamily: 'OnulDaisy',
                      lineHeight: '1.7',
                      whiteSpace: 'pre-wrap'
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