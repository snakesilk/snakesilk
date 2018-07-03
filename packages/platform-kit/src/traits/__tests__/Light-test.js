const expect = require('expect.js');

const {PointLight, SpotLight} = require('three');
const {createNode} = require('@snakesilk/testing/xml');
const {Parser} = require('@snakesilk/xml-loader');
const {Light} = require('@snakesilk/platform-traits');

const factory = require('..')['light'];

describe('Light factory', function() {
  let parser;

  beforeEach(() => {
    parser = new Parser.TraitParser();
  });

  it('creates a Light trait', () => {
    const node = createNode(`<trait/>`);
    trait = factory(parser, node)();
    expect(trait).to.be.a(Light);
  });

  describe('when no properties defined', () => {
    let trait;

    beforeEach(() => {
      const node = createNode(`<trait/>`);
      trait = factory(parser, node)();
    });

    it('has no lamps', () => {
      expect(trait.lamps.length).to.be(0);
    });
  });

  describe('Lamps', () => {
    let trait;

    describe('Location', () => {
      ['point', 'spot'].forEach(lampType => {
        describe(`when parsing ${lampType}`, () => {
          let lamp;

          describe('with no specification', () => {
            beforeEach(() => {
              const node = createNode(`<trait>
                <lamps>
                  <point/>
                </lamps>
              </trait>`);
              trait = factory(parser, node)();
              lamp = trait.lamps[0];
            });

            it('has default position', () => {
              expect(lamp.light.position).to.eql({
                x: 0,
                y: 0,
                z: 0,
              });
            });

            it('has default color', () => {
              expect(lamp.light.color).to.eql({
                r: 1,
                g: 1,
                b: 1,
              });
            });

            it('has default intensity', () => {
              expect(lamp.intensity).to.be(1);
            });

            it('is on by default', () => {
              expect(lamp.state).to.be(true);
            });
          });

          describe('with position', () => {
            beforeEach(() => {
              const node = createNode(`<trait>
                <lamps>
                  <point>
                    <position x="12.32" y="512.2" z="12.3"/>
                  </point>
                </lamps>
              </trait>`);
              trait = factory(parser, node)();
              lamp = trait.lamps[0];
            });

            it('position is applied', () => {
              expect(lamp.light.position).to.eql({
                x: 12.32,
                y: 512.2,
                z: 12.3,
              });
            });
          });

          [
            ['on', 1],
            ['off', 0],
          ].forEach(([attr, intensity]) => {
            describe(`with state "${attr}"`, () => {
              beforeEach(() => {
                const node = createNode(`<trait>
                  <lamps>
                    <point state="${attr}"/>
                  </lamps>
                </trait>`);
                trait = factory(parser, node)();
                lamp = trait.lamps[0];
              });

              it(`light is ${attr}`, () => {
                expect(lamp.light.intensity).to.be(intensity);
              });
            });
          });
        });
      });
    });

    describe('PointLight', () => {
      let lamp;

      beforeEach(() => {
        const node = createNode(`<trait>
          <lamps>
            <point color=".5,.1,.9" intensity=".5" distance="13.123"/>
          </lamps>
        </trait>`);
        trait = factory(parser, node)();
      });

      it('lamp is added', () => {
        expect(trait.lamps.length).to.be(1);
      });

      describe('Lamp', () => {
        let lamp;

        beforeEach(() => {
          lamp = trait.lamps[0];
        });

        it('honors light type', () => {
          expect(lamp.light).to.be.a(PointLight);
        });

        it('color is honored', () => {
          expect(lamp.light.color).to.eql({
            r: 0.5,
            g: 0.1,
            b: 0.9,
          });
        });

        it('intensity is honored', () => {
          expect(lamp.intensity).to.be(0.5);
        });

        it('distance is honored', () => {
          expect(lamp.light.distance).to.be(13.123);
        });
      });
    });

    describe('SpotLight', () => {
      let lamp;

      beforeEach(() => {
        const node = createNode(`<trait>
          <lamps>
            <spot color=".5,.1,.9" intensity=".5" distance="13.123" angle="0.52" exponent="0.2">
              <target x="5.12" y="12.42" z="2.5"/>
            </spot>
          </lamps>
        </trait>`);
        trait = factory(parser, node)();
      });

      it('lamp is added', () => {
        expect(trait.lamps.length).to.be(1);
      });

      describe('Lamp', () => {
        let lamp;

        beforeEach(() => {
          lamp = trait.lamps[0];
        });

        it('honors light type', () => {
          expect(lamp.light).to.be.a(SpotLight);
        });

        it('color is honored', () => {
          expect(lamp.light.color).to.eql({
            r: 0.5,
            g: 0.1,
            b: 0.9,
          });
        });

        it('intensity is honored', () => {
          expect(lamp.intensity).to.be(0.5);
        });

        it('angle is honored', () => {
          expect(lamp.light.angle).to.be(0.52);
        });

        it('exponent is honored', () => {
          expect(lamp.light.exponent).to.be(0.2);
        });

        it('target is honored', () => {
          expect(lamp.light.target.position).to.eql({
            x: 5.12,
            y: 12.42,
            z: 2.5,
          });
        });
      });
    });
  });
});
